import { NotFoundError } from '../../errors/NofoundError.js'
import ServiceErrorHandler from '../../errors/ServiceErrorHandler.js'
import Database from '../../database/database.js'
import { sequelize } from '../../database/database.js'
import pkg from '../../config/config.js'
import { Op } from 'sequelize'
import process from 'process'
import { User } from '../../models/UserModel.js'
import bcrypt from 'bcrypt'


const currentEnv = process.env.NODE_ENV || 'development'
const saltRounds = pkg[currentEnv].saltRounds

class UserService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor() {
        this.db = new Database()
        this.#error
    }

    /**
     * Creates a new user with the given email, password, and role_id.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @param {number} role_id - The role ID of the user.
     * @return {Promise<Object>} - A promise that resolves to the created user object without the password.
     * @throws {ServiceError} - If an error occurs during user creation.
     */
    createUser(email, password, role_id, current_user, options={}) {
        return this.#error.handler(['Create user'], async() => {
     
            if (current_user && current_user?.role_name != 'admin' && (role_id == 1 || role_id == 2)) {
                throw new Error ('Forbidden')
            }
            let user = null

            const newUser = await User.create({
                email: email,
                password: await bcrypt.hash(password, saltRounds),
                role_id: role_id,
                tenant_id: current_user ? current_user.tenant_id : null
            },
            {
                transaction: options?.transaction
            },
            {
                raw: true
            }
            ) 

            if (current_user) {
                user = this.detelePassword(newUser)
            }

            if (!current_user) {
                user = await this.updateUser(newUser.id, {tenant_id: newUser.id}, options)
            }

            return user
        })
    }


    /**
     * Creates a new store owner user, initializes a tenant schema for that user,
     * and registers the owner as a seller with supervisor privileges.
     *
     * This operation is executed in two main phases:
     *
     * **Phase 1 — Create the store owner user (public.users):**
     * - Hashes the provided password.
     * - Creates a new user with role_id = 2 (storeOwner).
     * - Sets the user's tenant_id to match its own id (each store owner becomes its own tenant).
     * - Runs inside a database transaction to ensure atomicity.
     *
     * **Phase 2 — Initialize tenant schema and create the seller record:**
     * - Establishes a tenant-specific database connection using the newly assigned tenant_id.
     * - Creates a seller entry inside the tenant schema, marking the user as the supervisor.
     *
     * If Phase 2 fails, the method performs manual compensation by deleting the previously
     * created user to avoid leaving orphaned records without a corresponding tenant.
     *
     * @async
     * @function createNewStore
     * @param {string} email - Email address for the new store owner.
     * @param {string} password - Raw password to be hashed and stored.
     * @param {string} given_name - First name of the store owner.
     * @param {string} last_name - Last name of the store owner.
     * @param {string} id_number - Identification number of the store owner.
     * @param {string} address - Physical address of the store owner.
     * @param {string} pin - Security PIN for the store owner (stored in tenant schema).
     *
     * @returns {Promise<Object>} An object containing:
     * - `newStore`: The newly created user record.
     * - `seller`: The seller record created inside the tenant schema.
     *
     * @throws {Error} Throws if user creation fails, tenant initialization fails,
     * or seller creation fails. In case of tenant/seller failure, the user is deleted
     * to maintain consistency.
     */
    createNewStore(email, password, given_name, last_name, id_number, address, pin) {
    return this.#error.handler(['Create new Store'], async () => {
        const t = await sequelize.transaction()
        let newStoreOwner

        // --- 1: Create new user public.users ---
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            newStoreOwner = await User.create(
                {
                    email,
                    password: hashedPassword,
                    role_id: 2, // storeOwner
                    tenant_id: null
                },
                { transaction: t }
            )

            // same user id is tenant_id
            await newStoreOwner.update(
                { tenant_id: newStoreOwner.id },
                { transaction: t }
            )

            await t.commit()
        } catch (err) {
            await t.rollback()
            throw err
        }

        // --- 2: create tenan schema t + storeOwner seller ---
        try {
            const tenant = await this.db.tenant.TenantConnection(newStoreOwner.tenant_id)

            const ownerSeller = await tenant.models.Seller.create({
                user_id: newStoreOwner.id,
                name: given_name,
                last_name: last_name,
                id_number: id_number,
                address: address, 
                pin: pin,
                is_supervisor: true 
            })

            return {
                newStore: newStoreOwner,
                seller: ownerSeller
            }
        } catch (err) {
            // Manual compensation: If the schema/seller fails, we don't leave
            // an orphaned user without a store
                await User.destroy({ where: { id: newStoreOwner.id }, force: true })
                throw err
            }
        })
    }

    /**
     * Updates a store owner in the public.users table and synchronizes editable fields
     * with the corresponding Seller record inside the tenant schema.
     *
     * The update process is executed in two phases:
     *
     * **Phase 1 — Update public.users (email and/or password):**
     * - Validates that the store owner exists.
     * - Applies email and/or password changes inside a transaction.
     * - Hashes the password if provided.
     * - Ensures validation rules such as unique email and minimum password length.
     *
     * **Phase 2 — Update Seller record inside the tenant schema:**
     * - Retrieves the tenant-specific database connection using tenant_id.
     * - Locates the Seller record associated with the user.
     * - Updates only editable fields: name, last_name, id_number, and address.
     * - If this phase fails, the method restores the previous email to avoid inconsistency.
     *
     * @async
     * @function updateStoreOwner
     * @param {number} userId - The ID of the store owner to update.
     * @param {Object} updates - Fields to update for both the user and seller.
     * @param {string} [updates.email] - New email for the store owner.
     * @param {string} [updates.password] - New raw password to be hashed.
     * @param {string} [updates.name] - Updated first name for the seller record.
     * @param {string} [updates.last_name] - Updated last name for the seller record.
     * @param {string} [updates.id_number] - Updated identification number.
     * @param {string} [updates.address] - Updated physical address.
     *
     * @returns {Promise<Object>} An object containing:
     * - `storeOwner`: The updated user record.
     * - `seller`: The updated seller record inside the tenant schema.
     *
     * @throws {Error} Throws if the store owner does not exist, if validation fails,
     * or if the Seller record cannot be found. If Phase 2 fails, the previous email
     * is restored to maintain consistency.
    */
    updateStoreOwner(userId, updates) {
    return this.#error.handler(['Update Store Owner'], async () => {
            const storeOwner = await User.findByPk(userId)
            if (!storeOwner) {
                throw new Error('Store owner not found')
            }

            // --- Step 1: Update public.users (email and/or password) ---
            const t = await sequelize.transaction()
            const previousEmail = storeOwner.email

            try {
                if (updates.email !== undefined) {
                    storeOwner.email = updates.email
                }

                if (updates.password) {
                    storeOwner.password = await bcrypt.hash(updates.password, saltRounds)
                }
                
                // Validates email format, uniqueness, and password length
                await storeOwner.save({ transaction: t }) 
                await t.commit()
            } catch (err) {
                await t.rollback()
                throw err
            }

             // --- Step 2: Update Seller inside the tenant schema ---
            try {
                const tenant = await this.db.tenant.TenantConnection(storeOwner.tenant_id)
                const seller = await tenant.models.Seller.findOne({
                    where: { user_id: storeOwner.id }
                })
                if (!seller) {
                    throw new Error('Seller record not found for this store owner')
                }

                const editableFields = ['name', 'last_name', 'id_number', 'address']
                editableFields.forEach((field) => {
                    if (updates[field] !== undefined) {
                        seller[field] = updates[field]
                    }
                })
                await seller.save()

                return { storeOwner, seller }
            } catch (err) {
                // Restore previous email to avoid inconsistent state
                await storeOwner.update({ email: previousEmail })
                throw err
            }
        })
    }

    /**
     * Retrieves all users with pagination.
     * @param {number} limit - The maximum number of users to retrieve.
     * @param {number} offset - The number of users to skip before starting to retrieve.
     * @return {Promise<Array>} - A promise that resolves to an array of user objects.
     * @throws {ServiceError} - If an error occurs during user retrieval.
     */
    getAllUser(limit=10, offset=0) {
        return this.#error.handler(['Read All Users'], async() => {
            const users = await User.findAll({
                attributes: ['id', 'email', 'role_id'],
                include: [
                    {
                        association: 'role',
                        attributes: ['name']
                    }
                ],
                limit: limit,
                offset: offset
            })
            return users
        })
    }

    /**
     * Searches for store owners by email.
     * @param {string} query - The email to search for.
     * @param {number} [limitResults=8] - The maximum number of results to return.
     * @return {Promise<Object>} - A promise that resolves to an object containing search results and pagination info.
     * @throws {ServiceError} - If an error occurs during the search.
     */
    searchStoreownnerUsers(query, page=1, limitResults=8) {
        const offset = (page - 1) * limitResults
        return this.#error.handler(['Search store owners', query, 'Users'],  async() => {
            const results = await User.findAll({
                where: {
                    email: {[Op.substring]: query},
                    role_id: 2 // only store owner
                },
                attributes: ['id', 'email', 'tenant_id', 'deletedAt'],
                include: [
                    {
                        association: 'role',
                        attributes: ['name']
                    }
                ],
                limit: limitResults,
                offset: offset
            })
            return {
                storeOwners: results
            }
        })
    }

    /**
     * Retrieves all store-owners users with pagination.
     * @param {number} limit - The maximum number of users to retrieve.
     * @param {number} offset - The number of users to skip before starting to retrieve.
     * @return {Promise<Array>} - A promise that resolves to an array of user objects.
     * @throws {ServiceError} - If an error occurs during user retrieval.
     */
    getStoreOwner(limit=10, offset=0) {
        return this.#error.handler(['Read store owner users'], async() => {
            const users = await User.findAll({
                where: {
                    role_id: 2
                },
                attributes: ['id', 'email', 'tenant_id', 'deletedAt'],
                include: [
                    {
                        association: 'role',
                        attributes: ['name']
                    }
                ],
                limit: limit,
                offset: offset
            })
            return {
                users: users
            }
        })
    }

    /**
     * Calculates the total number of pages forusers results based on a tenant_id and limit.
     * * @param {string} [query=''] - The tenant_id term to filter users.
     * @param {number} [limit=10] - The number of records to display per page.
     * @returns {Promise<number>} A promise that resolves to the total number of calculated pages.
     * @throws Will be handled by the internal error handler.
     */
    totalPages(tenant_id = null, limit = 10, query = '') {
        return this.#error.handler(['Total pages', tenant_id, 'Users'], async() => {
            let whereClause = {}
            
            if(tenant_id) {
                whereClause = {
                    tenant_id: tenant_id
                }
            }else {
                whereClause = {
                    role_id: 2
                }
            }
            
            if(!query) {
                const count = await User.count({
                where: whereClause
                })

                return Math.ceil(count / limit)
            }

            const results = await User.findAndCountAll({
                where: {
                    email: {[Op.substring]: query},
                    role_id: 2 // only store owner
                },
            })

            return Math.ceil(results.count / limit)
            
            
        })
    }

    /**
     * Retrieves a user by their ID.
     * @param {number} id - The ID of the user to retrieve.
     * @return {Promise<Object>} - A promise that resolves to the user object without the password.
     * @throws {ServiceError} - If the user is not found or an error occurs during retrieval.
     * 
     */
    getUser(id, options={}) {
        return this.#error.handler(['Read user', id, 'User'], async() => {
            const user = await User.findByPk(id, {
                attributes: ['id', 'email'],
                include: [
                    {
                        association: 'role',
                        attributes: ['name']
                    }
                ]

            },
            {
                transaction: options?.transaction
            }
            )
            if(!user) {
                throw new NotFoundError()
            }
            return user
        })
    }

    /**
     * Retrieves a store owner (public.users row) together with their seller
     * record from the tenant schema, so the edit form can precargarse completo.
     * @param {number} id - The store owner's user id (= tenant_id).
     * @returns {Promise<{user: Object, seller: Object|null}>}
     */
    getStoreOwner(id) {
        return this.#error.handler(['Read store owner', id, 'User'], async () => {
            const user = await User.findByPk(id, {
                attributes: ['id', 'email', 'tenant_id'],
                include: [{ association: 'role', attributes: ['name'] }]
            })
            if (!user) {
                throw new NotFoundError()
            }

            const tenant = await this.db.tenant.TenantConnection(user.tenant_id)
            const seller = await tenant.models.Seller.findOne({
                where: { user_id: user.id }
            })

            return { user, seller }
        })
    }

    /**
     * Retrieves a user by a given email.
     * @param {String} email - The meail of the user to retrieve.
     * @return {Promise<Object>} - A promise that resolves to the user object.
     * @throws {ServiceError} - If an error occurs during retrieval.
     */
    findUserByEmail(email) {
        return this.#error.handler(['Finding User', email, 'User'], async() => {
            const user = await User.findOne({
                where: {
                    email: email
                }
            })
            
            return user
        })
    }

    /**
     * Updates a user with the given ID and updates.
     * @param {number} userId - The ID of the user to update.
     * @param {Object} updates - An object containing the updates to apply to the user.
     * @return {Promise<Object>} - A promise that resolves to the updated user object without the password.
     * @throws {ServiceError} - If the user is not found or an error occurs during the update.
     */
    updateUser(userId, updates, options={}) {
        return this.#error.handler(['Update User', userId, 'User'], async() => {
            const user = await this.getUser(userId, options)
            const updatedUser = await user.update(updates)
            const safeUser = this.detelePassword(updatedUser)
            return safeUser
        })
    }

    /**
     * Deletes a user by their ID.
     * @param {number} userId - The ID of the user to delete.
     * @return {Promise<number>} - A promise that resolves to the number of deleted users (1 if successful).
     * @throws {ServiceError} - If the user is not found or an error occurs during deletion.
     * @return 1 if user is deleted successfully
     */
    deleteUser(userId) {
        return this.#error.handler(['Delete User', userId, 'User'], async() => {
            const user = await this.getUser(userId)
            //delete user
            await user.destroy()
            return 1
        })
    }

    /**
     * Deletes the password field from the user object.
     * @param {Object} obj - The user object to process.
     * @return {Object} - The user object without the password field.
     */
    detelePassword(obj) {
        const objNotPassword ={...obj.toJSON()}
        delete objNotPassword.password
        return objNotPassword
    }

    /**
     * Verifies a user's password using bcrypt.
     *
     * @param {object} user - The user object containing the hashed password.
     * @param {string} password - The raw password string to verify.
     * @returns {Promise<boolean>} Resolves to `true` if the password is correct, otherwise `false`.
     */
    async _verifyPassword(user, password) {
        return await bcrypt.compare(password, user.password)
    }

}

export default UserService
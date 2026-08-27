import { NotFoundError } from '../../errors/NofoundError.js'
import ServiceErrorHandler from '../../errors/ServiceErrorHandler.js'
import Database from '../../database/database.js'
import { sequelize } from '../../database/database.js'
import pkg from '../../config/config.js'
import { Op } from 'sequelize'
import process from 'process'
import { User } from '../../models/UserModel.js'
import { Store } from '../../models/StoreModel.js'
import { SubscriptionPayment } from '../../models/SubscriptionPaymentModel.js'
import StorageService from '../StorageService.js'
import bcrypt from 'bcrypt'


const currentEnv = process.env.NODE_ENV || 'development'
const saltRounds = pkg[currentEnv].saltRounds

class UserService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor() {
        this.db = new Database()
        this.storage = new StorageService()
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
     * Creates a new store owner user, its store profile, initializes a tenant schema,
     * and registers the owner as a seller with supervisor privileges.
     *
     * **Phase 1 — Create the store owner user and store profile (public schema):**
     * - Hashes the provided password.
     * - Creates a new user with role_id = 2 (storeOwner).
     * - Sets the user's tenant_id to match its own id.
     * - Creates the Store row linked to that same tenant_id.
     * - Runs inside a single transaction (User y Store viven en la misma conexión pública).
     *
     * **Phase 2 — Initialize tenant schema and create the seller record:**
     * - Establishes a tenant-specific database connection using the newly assigned tenant_id.
     * - Creates a seller entry inside the tenant schema, marking the user as the supervisor.
     *
     * If Phase 2 fails, deletes the previously created user and store to avoid orphaned records.
     *
     * @param {string} email
     * @param {string} password
     * @param {Object} details
     * @param {string} details.given_name
     * @param {string} details.last_name
     * @param {string} details.id_number
     * @param {string} details.address
     * @param {string} details.pin
     * @param {string} details.store_name
     * @param {string} [details.fiscal_id] - Opcional.
     * @param {string} details.phone
     * @returns {Promise<{newStore: Object, store: Object, seller: Object}>}
     */
    createNewStore(email, password, details) {
    return this.#error.handler(['Create new Store'], async () => {
        const { given_name, last_name, id_number, address, pin, store_name, fiscal_id, phone } = details

        const t = await sequelize.transaction()
        let newStoreOwner
        let newStoreInfo

        // --- 1: Create new user + store profile in public ---
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

            newStoreInfo = await Store.create(
                {
                    tenant_id: newStoreOwner.id,
                    name: store_name,
                    fiscal_id: fiscal_id || null,
                    address,
                    phone,
                    subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                },
                { transaction: t }
            )

            await t.commit()
        } catch (err) {
            await t.rollback()
            throw err
        }

        // --- 2: create tenant schema + storeOwner seller ---
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
                store: newStoreInfo,
                seller: ownerSeller
            }
        } catch (err) {
                // Manual compensation: phase 1 ya quedó confirmado (commit)
                await Store.destroy({ where: { tenant_id: newStoreOwner.id } })
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
            const storeOwner = await User.findByPk(userId, {
                include: [{ association: 'store' }]
            })
            
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

                if (storeOwner.store) {
                    if (updates.store_name !== undefined) storeOwner.store.name = updates.store_name
                    if (updates.fiscal_id !== undefined) storeOwner.store.fiscal_id = updates.fiscal_id || null
                    if (updates.store_phone !== undefined) storeOwner.store.phone = updates.store_phone
                    if (updates.store_address !== undefined) storeOwner.store.address = updates.store_address
                    await storeOwner.store.save({ transaction: t })
                }
            
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
                    [Op.or]: [
                        { email: { [Op.substring]: query } },
                        { '$store.name$': { [Op.substring]: query} }
                    ]
                },
                attributes: ['id', 'email', 'tenant_id', 'deletedAt'],
                include: [
                    { association: 'role', attributes: ['name'] },
                    { association: 'store', attributes: ['name', 'is_active'], required: false }
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
    getAllStoreOwner(limit=10, offset=0) {
        return this.#error.handler(['Read store owner users'], async() => {
            const users = await User.findAll({
                where: {
                    role_id: 2
                },
                attributes: ['id', 'email', 'tenant_id', 'deletedAt'],
                include: [
                    { association: 'role', attributes: ['name'] },
                    { association: 'store', attributes: ['name', 'is_active'], required: false }
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
                    role_id: 2,
                    [Op.or]: [
                        { email: { [Op.substring]: query } },
                        { '$store.name$': { [Op.substring]: query } }
                    ]
                },
                include: [
                    { association: 'store', attributes: [], required: false }
                ],
                distinct: true
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
     * Retrieves detailed information about a store owner, including:
     * - Basic user data (id, email, tenant_id)
     * - Associated role
     * - Associated store
     * - Seller record inside the tenant schema
     * - Store statistics (seller count, customer count, last invoice date)
     *
     * This method performs queries both in the main public schema and
     * inside the tenant-specific schema associated with the store owner.
     *
     * @async
     * @function getStoreOwner
     * @param {number} id - The ID of the store owner (user) to retrieve.
     *
     * @returns {Promise<Object>} An object containing:
     * - `user`: The user record with role and store associations.
     * - `seller`: The seller record inside the tenant schema.
     * - `stats`: Aggregated store statistics:
     *      - `sellerCount`: Total number of sellers in the tenant.
     *      - `customerCount`: Total number of customers in the tenant.
     *      - `lastInvoiceDate`: Date of the most recent invoice, or null if none exist.
     *
     * @throws {NotFoundError} If the user does not exist.
     */
    getStoreOwner(id) {
    return this.#error.handler(['Read store owner', id, 'User'], async () => {
        const user = await User.findByPk(id, {
            attributes: ['id', 'email', 'tenant_id'],
            include: [
                { association: 'role', attributes: ['name'] },
                { association: 'store' }
            ]
        })
        
        if (!user) {
            throw new NotFoundError()
        }

        const tenant = await this.db.tenant.TenantConnection(user.tenant_id)
        
        const seller = await tenant.models.Seller.findOne({
            where: { user_id: user.id }
        })

        const [sellerCount, customerCount, lastInvoice] = await Promise.all([
            tenant.models.Seller.count(),
            tenant.models.Customer.count(),
            tenant.models.Invoice.findOne({
                attributes: ['id', 'date'],
                order: [['date', 'DESC']]
            })
        ])

            return {
                user,
                seller,
                stats: {
                    sellerCount,
                    customerCount,
                    lastInvoiceDate: lastInvoice?.date || null
                }
            }
        })
    }

    /**
     * Retrieves a user by a given email. Also attaches `store_name` (the store the
     * user belongs to, looked up by `tenant_id`, not by ownership) so it can be
     * embedded in the JWT at login and avoid a separate request on every page.
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

            if (user && user.tenant_id) {
                const store = await Store.findOne({
                    where: { tenant_id: user.tenant_id },
                    attributes: ['name']
                })
                user.store_name = store?.name || null
            }

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
     * Renews a store's subscription by extending its expiration date.
     *
     * The renewal logic works as follows:
     * - If the current subscription is still active (expiration date is in the future),
     *   the renewal is added on top of the existing expiration date.
     * - If the subscription has already expired, the renewal starts from the current date.
     *
     * This ensures that active subscribers do not lose remaining days,
     * while expired subscribers restart their subscription from today.
     *
     * @async
     * @function renewSubscription
     * @param {number} tenantId - The tenant ID associated with the store.
     * @param {number} [days=30] - Number of days to extend the subscription.
     *
     * @returns {Promise<Object>} The updated store record with the new expiration date.
     *
     * @throws {NotFoundError} If the store does not exist.
     */
    renewSubscription(tenantId, days = 30) {
        return this.#error.handler(['Renew subscription', tenantId, 'Store'], async () => {
            const store = await Store.findOne({ where: { tenant_id: tenantId } })
            if (!store) {
                throw new NotFoundError()
            }

            const now = new Date()
            const currentExpiry = store.subscription_expires_at
            const base = (currentExpiry && currentExpiry > now) ? currentExpiry : now 
            const newExpiry = new Date(base.getTime() + days * 24 * 60 * 60 * 1000)

            await store.update({ subscription_expires_at: newExpiry })
            return store
        })
    }

    /**
     * Blocks a store for abuse or policy violations (e.g. illegal use of the platform).
     * This is independent of the billing-driven deactivation: it deactivates the store
     * and records the reason and timestamp, so an unrelated subscription payment does not
     * silently reactivate a store that was blocked for policy reasons.
     *
     * @async
     * @function blockStore
     * @param {number} tenantId - The tenant ID associated with the store.
     * @param {string} reason - The reason for the block, shown to the admin later.
     *
     * @returns {Promise<Object>} The updated (blocked) store record.
     *
     * @throws {NotFoundError} If the store does not exist.
     */
    blockStore(tenantId, reason) {
        return this.#error.handler(['Block store', tenantId, 'Store'], async () => {
            const store = await Store.findOne({ where: { tenant_id: tenantId } })
            if (!store) {
                throw new NotFoundError()
            }

            await store.update({
                is_active: false,
                blocked_reason: reason,
                blocked_at: new Date()
            })

            return store
        })
    }

    /**
     * Unblocks a previously blocked store, reactivating it and clearing the block reason.
     * Note: this does not touch `subscription_expires_at` — it only reverses a manual block.
     *
     * @async
     * @function unblockStore
     * @param {number} tenantId - The tenant ID associated with the store.
     *
     * @returns {Promise<Object>} The updated (unblocked) store record.
     *
     * @throws {NotFoundError} If the store does not exist.
     */
    unblockStore(tenantId) {
        return this.#error.handler(['Unblock store', tenantId, 'Store'], async () => {
            const store = await Store.findOne({ where: { tenant_id: tenantId } })
            if (!store) {
                throw new NotFoundError()
            }

            await store.update({
                is_active: true,
                blocked_reason: null,
                blocked_at: null
            })

            return store
        })
    }

    /**
     * Retrieves pending subscription payments awaiting admin review, oldest first
     * (fair queue), including the submitting store's name and owner email, along
     * with the total count (for paginating the list on the frontend).
     *
     * @async
     * @function getPendingPayments
     * @param {number} [limit=10] - Max number of records.
     * @param {number} [page=1] - Page number.
     *
     * @returns {Promise<Object>} { payments, total }
     */
    getPendingPayments(limit = 10, page = 1) {
        const offset = (page - 1) * limit
        return this.#error.handler(['Read pending payments', null, 'SubscriptionPayment'], async () => {
            const [payments, total] = await Promise.all([
                SubscriptionPayment.findAll({
                    where: { status: 'pending' },
                    include: [{
                        association: 'owner',
                        attributes: ['id', 'email'],
                        include: [{ association: 'store', attributes: ['name'] }]
                    }],
                    order: [['submitted_at', 'ASC']],
                    limit,
                    offset
                }),
                SubscriptionPayment.count({ where: { status: 'pending' } })
            ])
            return { payments, total }
        })
    }

    /**
     * Generates a short-lived signed URL so an admin can privately view a payment's receipt image.
     *
     * @async
     * @function getPaymentReceiptUrl
     * @param {number} paymentId - The SubscriptionPayment ID.
     *
     * @returns {Promise<string>} The signed URL.
     *
     * @throws {NotFoundError} If the payment does not exist.
     */
    getPaymentReceiptUrl(paymentId) {
        return this.#error.handler(['Read payment receipt', paymentId, 'SubscriptionPayment'], async () => {
            const payment = await SubscriptionPayment.findByPk(paymentId)
            if (!payment) {
                throw new NotFoundError()
            }
            return this.storage.getSignedDownloadUrl(payment.receipt_key)
        })
    }

    /**
     * Approves a pending subscription payment: marks it reviewed and renews the
     * store's subscription (reusing `renewSubscription`).
     *
     * @async
     * @function approvePayment
     * @param {number} paymentId - The SubscriptionPayment ID.
     * @param {number} adminId - The id of the admin approving it.
     * @param {number} [days=30] - Number of days to extend the subscription.
     *
     * @returns {Promise<Object>} { payment, store }
     *
     * @throws {NotFoundError} If the payment does not exist.
     * @throws {Error} If the payment was already reviewed.
     */
    approvePayment(paymentId, adminId, days = 30) {
        return this.#error.handler(['Approve payment', paymentId, 'SubscriptionPayment'], async () => {
            const payment = await SubscriptionPayment.findByPk(paymentId)
            if (!payment) {
                throw new NotFoundError()
            }
            if (payment.status !== 'pending') {
                throw new Error('Este pago ya fue revisado.')
            }

            await payment.update({
                status: 'approved',
                reviewed_at: new Date(),
                reviewed_by: adminId
            })

            const store = await this.renewSubscription(payment.tenant_id, days)

            return { payment, store }
        })
    }

    /**
     * Rejects a pending subscription payment, recording the reason. Does not touch the
     * store's subscription — the owner can submit a new receipt.
     *
     * @async
     * @function rejectPayment
     * @param {number} paymentId - The SubscriptionPayment ID.
     * @param {number} adminId - The id of the admin rejecting it.
     * @param {string} reason - Why the payment was rejected.
     *
     * @returns {Promise<Object>} The updated (rejected) payment.
     *
     * @throws {NotFoundError} If the payment does not exist.
     * @throws {Error} If the payment was already reviewed.
     */
    rejectPayment(paymentId, adminId, reason) {
        return this.#error.handler(['Reject payment', paymentId, 'SubscriptionPayment'], async () => {
            const payment = await SubscriptionPayment.findByPk(paymentId)
            if (!payment) {
                throw new NotFoundError()
            }
            if (payment.status !== 'pending') {
                throw new Error('Este pago ya fue revisado.')
            }

            await payment.update({
                status: 'rejected',
                reviewed_at: new Date(),
                reviewed_by: adminId,
                rejection_reason: reason
            })

            return payment
        })
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
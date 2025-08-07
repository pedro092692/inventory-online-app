import { NotFoundError } from '../../errors/NofoundError.js'
import ServiceErrorHandler from '../../errors/ServiceErrorHandler.js'
import pkg from '../../config/config.js'
import process from 'process'
import { User } from '../../models/UserModel.js'
import bcrypt from 'bcrypt'


const currentEnv = process.env.NODE_ENV || 'development'
const saltRounds = pkg[currentEnv].saltRounds




class UserService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor() {
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
    createUser(email, password, role_id, tenant_id=false) {
        return this.#error.handler(['Create user'], async() => {
            const newUser = await User.create({
                email: email,
                password: await bcrypt.hash(password, saltRounds),
                role_id: role_id
            })
            // add the tenant id 
            const updatedUser = await this.updateUser(newUser.id, {tenant_id: tenant_id || newUser.id})
            return updatedUser
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
     * Retrieves a user by their ID.
     * @param {number} id - The ID of the user to retrieve.
     * @return {Promise<Object>} - A promise that resolves to the user object without the password.
     * @throws {ServiceError} - If the user is not found or an error occurs during retrieval.
     * 
     */
    getUser(id) {
        return this.#error.handler(['Read user', id, 'User'], async() => {
            const user = await User.findByPk(id)
            if(!user) {
                throw new NotFoundError()
            }
            const safeUser = this.detelePassword(user)
            return safeUser
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
    updateUser(userId, updates) {
        return this.#error.handler(['Update User', userId, 'User'], async() => {
            const user = await this.getUser(userId)
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

    async _verifyPassword(user, password) {
        return await bcrypt.compare(password, user.password)
    }

}

export default UserService
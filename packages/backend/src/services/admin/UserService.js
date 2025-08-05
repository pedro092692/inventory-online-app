import { NotFoundError } from '../../errors/NofoundError.js'
import ServiceErrorHandler from '../../errors/ServiceErrorHandler.js'
import { User } from '../../models/UserModel.js'

class UserService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor() {
        this.#error
    }

    /**
     * Creates a new user with the given email, password, and roleId.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @param {number} roleId - The role ID of the user.
     * @return {Promise<Object>} - A promise that resolves to the created user object without the password.
     * @throws {ServiceError} - If an error occurs during user creation.
     */
    createUser(email, password, roleId) {
        return this.#error.handler(['Create user'], async() => {
            const newUser = await User.create({
                email: email,
                password: password,
                roleId: roleId
            })
            const user = this.detelePassword(newUser)
            return user
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
                attributes: ['id', 'email', 'roleId'],
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

}

export default UserService
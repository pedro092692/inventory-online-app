import UserService from '../../services/admin/UserService.js'
import controllerErrorHandler from '../../errors/controllerErrorHandler.js'

class UserController {
    // new instance of controller error handler 
    #error = new controllerErrorHandler()

    constructor(){
        this.User = new UserService()
        this.#error
    }

    /**
     * Creates a new user.
     * @param {Object} req - request object containing user details in the body
     * @param {Object} res - response object to send the created user
     * @throws {ServiceError} - throws an error if the user could not be created
     * @returns {Promise<void>} - returns the created user in the response
     */
    createUser = this.#error.handler( async(req, res) => {
        const { email, password, roleId } = req.body
        const user = await this.User.createUser(email, password, roleId)
        res.status(201).json(user)
    })
    
    /**
     * Retrieves all users.
     * @param {Object} req - request object
     * @param {Object} res - response object to send the list of users
     * @throws {ServiceError} - throws an error if the users could not be retrieved
     * @returns {Promise<void>} - returns the list of users in the response
     */
    getAllUsers = this.#error.handler( async(req, res) => {
        const users = await this.User.getAllUser()
        res.status(200).json(users)
    })

    /**
     * Retrieves a user by their ID.
     * @param {Object} req - request object containing the user ID in the params
     * @param {Object} res - response object to send the user details
     * @throws {ServiceError} - throws an error if the user could not be found
     * @returns {Promise<void>} - returns the user details in the response
     */
    getUser = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const user = await this.User.getUser(id)
        res.status(200).json(user)
    })

    /**
     * Updates a user by their ID.
     * @param {Object} req - request object containing the user ID and updates in the body
     * @param {Object} res - response object to send the updated user
     * @throws {ServiceError} - throws an error if the user could not be updated
     * @returns {Promise<void>} - returns the updated user in the response
     */
    updateUser = this.#error.handler( async(req, res) => {
        const userId = req.body.userId
        const updates = req.body.updates
        const updatedUser = await this.User.updateUser(userId, updates)
        res.status(200).json(updatedUser)
    })

    /**
     * Deletes a user by their ID.
     * @param {Object} req - request object containing the user ID in the body
     * @param {Object} res - response object to send the deletion confirmation
     * @throws {ServiceError} - throws an error if the user could not be deleted
     * @returns {Promise<void>} - returns a confirmation message in the response
     */
    deleteUser = this.#error.handler( async(req, res) => {
        const userId = req.body.userId
        // delete user 
        await this.User.deleteUser(userId)
        res.status(200).json({message: 'User has been deleted'});
    })
}

export default UserController
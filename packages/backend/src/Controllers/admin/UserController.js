import UserService from '../../services/admin/UserService.js'
import controllerErrorHandler from '../../errors/controllerErrorHandler.js'

class UserController {
    // new instance of controller error handler 
    #error = new controllerErrorHandler()

    constructor() {
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
        let { email, password, role_id  } = req.body
        const user = await this.User.createUser(email, password, role_id)
        res.status(201).json(user)
    })

    /**
     * Creates a new store and seller.
     * @param {Object} req - request object containing user details in the body
     * @param {Object} res - response object to send the created user
     * @throws {ServiceError} - throws an error if the user could not be created
     * @returns {Promise<void>} - returns the created user in the response
     */
    createNewStore = this.#error.handler( async(req, res) => {
        const { email, password, given_name, last_name, id_number, address, pin } = req.body
        const { newStore, seller } = await this.User.createNewStore(email, password, given_name, last_name, id_number, address, pin)
        res.status(201).json({newStore, seller})
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
     * Retrieves all store owners users.
     * @param {Object} req - request object
     * @param {Object} res - response object to send the list of users
     * @throws {ServiceError} - throws an error if the users could not be retrieved
     * @returns {Promise<void>} - returns the list of users in the response
     */
    getAllStoreOwners = this.#error.handler( async(req, res) => {
        const {users} = await this.User.getAllStoreOwner()
        res.status(200).json({users})
    })

     /**
     * Searches for store owners user based on a query string.
     * @param {Object} req - request object containing the search query and pagination parameters
     * @param {Object} res - response object to send the search results
     * @throws {ServiceError} - throws an error if the search operation fails
     * @returns {Promise<void>} - returns the search results in the response
     */
    searchStoreOwners = this.#error.handler( async(req, res) => {
        const { query } = req.query
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const { storeOwners } = await this.User.searchStoreownnerUsers(query, page, limit)
        res.status(200).json({storeOwners})

    })

    /**
     * Retrieve the total number of pages for the users list.
     * * @async
     * @param {import('express').Request} req - Express request object.
     * @param {Object} req.query - Query parameters.
     * @param {string} [req.query.limit] - Max number of items per page (defaults to 10).
     * @param {string} [req.query.tenant_id] - Term to filter results.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>} Sends a JSON response with the total page count.
     */
    totalPages = this.#error.handler( async(req, res) => {
        const { data } = req.query
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const { tenant_id } = req.query || null
        const total = await this.User.totalPages(tenant_id, limit, data)
        res.status(200).json({total})
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
     * Retrieves a user and seller info by their ID.
     * @param {Object} req - request object containing the user ID in the params
     * @param {Object} res - response object to send the user details
     * @throws {ServiceError} - throws an error if the user could not be found
     * @returns {Promise<void>} - returns the user details in the response
     */
    getStoreOwner = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const storeOwner = await this.User.getStoreOwner(id)
        res.status(200).json(storeOwner)
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
     * Updates a store owner (and their linked seller record) by their user ID.
     * @param {Object} req - request object containing the store owner's user ID and updates in the body
     * @param {Object} res - response object to send the updated store owner
     * @throws {ServiceError} - throws an error if the store owner could not be updated
     * @returns {Promise<void>} - returns the updated store owner (and seller) in the response
     */
    updateStoreOwner = this.#error.handler( async(req, res) => {
        const userId = req.params.id
        const updates = req.body
        const updatedStoreOwner = await this.User.updateStoreOwner(userId, updates)
        res.status(200).json(updatedStoreOwner)
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
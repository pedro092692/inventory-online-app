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
        const { email, password, given_name, last_name, id_number, address, pin, store_name, fiscal_id, phone } = req.body
        const { newStore, store, seller } = await this.User.createNewStore(email, password, {
            given_name, last_name, id_number, address, pin, store_name, fiscal_id, phone
        })
        res.status(201).json({newStore, store, seller})
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
     * Blocks a store for abuse or policy violations.
     * @param {Object} req - request object containing the tenant ID in the params and the reason in the body
     * @param {Object} res - response object to send the updated store
     * @throws {ServiceError} - throws an error if the store could not be blocked
     * @returns {Promise<void>} - returns the updated (blocked) store in the response
     */
    blockStore = this.#error.handler( async(req, res) => {
        const { tenantId } = req.params
        const { reason } = req.body
        const store = await this.User.blockStore(tenantId, reason)
        res.status(200).json({store})
    })

    /**
     * Unblocks a previously blocked store.
     * @param {Object} req - request object containing the tenant ID in the params
     * @param {Object} res - response object to send the updated store
     * @throws {ServiceError} - throws an error if the store could not be unblocked
     * @returns {Promise<void>} - returns the updated (unblocked) store in the response
     */
    unblockStore = this.#error.handler( async(req, res) => {
        const { tenantId } = req.params
        const store = await this.User.unblockStore(tenantId)
        res.status(200).json({store})
    })

    /**
     * Retrieves subscription payments for admin review, optionally filtered by status.
     * @param {Object} req - request object with optional status/limit/page query params
     * @param {Object} res - response object to send the payments
     * @throws {ServiceError} - throws an error if the payments could not be retrieved
     * @returns {Promise<void>} - returns {payments, total, totalPages}
     */
    getPayments = this.#error.handler( async(req, res) => {
        const validStatuses = ['pending', 'approved', 'rejected']
        const status = validStatuses.includes(req.query.status) ? req.query.status : null
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const { payments, total } = await this.User.getPayments(status, limit, page)
        res.status(200).json({ payments, total, totalPages: Math.ceil(total / limit) || 1 })
    })

    /**
     * Generates a short-lived signed URL to view a payment's receipt image.
     * @param {Object} req - request object containing the payment ID in the params
     * @param {Object} res - response object to send the signed URL
     * @throws {ServiceError} - throws an error if the receipt URL could not be generated
     * @returns {Promise<void>} - returns {url}
     */
    getPaymentReceiptUrl = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const url = await this.User.getPaymentReceiptUrl(id)
        res.status(200).json({ url })
    })

    /**
     * Approves a pending subscription payment and renews the store's subscription.
     * @param {Object} req - request object containing the payment ID in the params
     * @param {Object} res - response object to send the updated payment and store
     * @throws {ServiceError} - throws an error if the payment could not be approved
     * @returns {Promise<void>} - returns {payment, store}
     */
    approvePayment = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const adminId = req.user.id
        const { payment, store } = await this.User.approvePayment(id, adminId)
        res.status(200).json({ payment, store })
    })

    /**
     * Rejects a pending subscription payment.
     * @param {Object} req - request object containing the payment ID in the params and the reason in the body
     * @param {Object} res - response object to send the updated payment
     * @throws {ServiceError} - throws an error if the payment could not be rejected
     * @returns {Promise<void>} - returns {payment}
     */
    rejectPayment = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const { reason } = req.body
        const adminId = req.user.id
        const payment = await this.User.rejectPayment(id, adminId, reason)
        res.status(200).json({ payment })
    })

    /**
     * Reverts a payment back to pending, undoing a mistaken approval or rejection. For a
     * previously approved payment this also rolls back the subscription-day extension it granted.
     * @param {Object} req - request object containing the payment ID in the params
     * @param {Object} res - response object to send the updated payment and store
     * @throws {ServiceError} - throws an error if the payment could not be reverted
     * @returns {Promise<void>} - returns {payment, store}
     */
    revertPayment = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const { payment, store } = await this.User.revertPayment(id)
        res.status(200).json({ payment, store })
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
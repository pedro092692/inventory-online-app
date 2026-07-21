import SellerService from '../services/SellerService.js'
import UserService from '../services/admin/UserService.js'
import controllerErrorHandler from '../errors/controllerErrorHandler.js'
import { userPermissions } from './CustomerController.js'
import hasPassword from '../utils/encrypt.js'
import { sequelize } from '../database/database.js'
import { ValidationError } from 'sequelize'

class SellerController {
    // new instance of controller error handler
    #error = new controllerErrorHandler()

    constructor(model) {
        this.sellerService = new SellerService(model)
        this.UserService = new UserService()
        this.#error
    }

    /**
     * Creates a new seller and its associated user within a single database transaction.
     *
     * This operation performs the following steps:
     * 1. Extracts seller and user data from the request body.
     * 2. Hashes the seller PIN (if provided) using a deterministic hash tied to the tenant.
     * 3. Creates a new user for the seller.
     * 4. Creates the seller linked to the newly created user.
     * 5. Commits the transaction if all operations succeed.
     *
     * If any step fails, the transaction is rolled back and the error is propagated.
     *
     * @async
     * @function createSeller
     * @param {Object} req - Express request object.
     * @param {Object} req.body - Incoming seller and user data.
     * @param {string} req.body.id_number - Seller identification number.
     * @param {string} req.body.name - Seller first name.
     * @param {string} req.body.last_name - Seller last name.
     * @param {string} req.body.address - Seller address.
     * @param {string} req.body.email - Email for the new user account.
     * @param {string} req.body.password - Password for the new user account.
     * @param {number} req.body.role_id - Role assigned to the new user.
     * @param {boolean} [req.body.is_supervisor=false] - Whether the seller is a supervisor.
     * @param {string|null} [req.body.pin=null] - Optional seller PIN (will be hashed).
     * @param {Object} req.user - Authenticated user performing the operation.
     * @param {number} req.user.tenant_id - Tenant ID used for hashing and scoping.
     *
     * @param {Object} res - Express response object.
     *
     * @throws {ServiceError|Error} - Throws if user or seller creation fails.
     * @returns {Promise<void>} Sends a JSON response containing the created seller and user.
     */
    createSeller = this.#error.handler( async(req, res) => {
        // create a user for the seller 
        const t = await sequelize.transaction()
        try {
            const { id_number, name, last_name, address, email, password, role_id } = req.body
            const is_supervisor = req.body.is_supervisor || false
            const pin = req.body.pin || null
            
            if (pin && pin.length < 4) {
                throw new ValidationError('El Pin tiene que tener al menos 4 caracteres')
            }
            const hashedPin = pin ? hasPassword(pin, String(req.user.tenant_id)) : null
            const current_user = req.user
            const user = await this.UserService.createUser(email, password, role_id, current_user, {transaction: t})
            if (!user) {
                throw new Error('Something went wrong')
            }
            // create seller
            const user_id = user.id
            const seller = await this.sellerService.createSeller(id_number, name, last_name, address, user_id, is_supervisor, hashedPin, 
                {transaction: t})
            
            if (!seller) {
                throw new Error('Something went wrong')
            }
            
            await t.commit()

            res.status(201).json({seller, user})
        
        }catch(error) {
            t.rollback()
            throw error
        }
        
    })
    
    /**
     * Authorizes a seller based on a PIN provided in the request body.
     *
     * This controller extracts the `pin` from the incoming request,
     * validates it through the SellerService, and returns the seller
     * information that authorized the action.
     *
     * @async
     * @function authorizedBySeller
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>} Sends a JSON response with the authorized seller.
     *
     * @throws {Error} If the seller cannot be authorized or the service fails.
     */
    authorizedBySeller = this.#error.handler( async(req, res) => {
        // get pin from req body
        const { pin } = req.body
        const tenant_id = req?.user?.tenant_id || null
        const hashedPin = hasPassword(pin, String(tenant_id))
        const seller = await this.sellerService.authorizeSeller(hashedPin)
        res.status(200).json({authorizedBy: seller})
    })

    /**
     * Retrieves all sellers.
     * @param {Object} req - request object
     * @param {Object} res - response object to send the list of sellers
     * @throws {ServiceError} - throws an error if the sellers could not be retrieved
     * @returns {Promise<void>} - returns the list of sellers in the response
     */
    allSeller = this.#error.handler(async(req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const includeInvoices = req.query.includeInvoices ? req.query.includeInvoices : false
        const currentUserId = req.user.id || null
        const permissions = userPermissions(req)
        const {sellers} = await this.sellerService.getAllSellers(limit, page, includeInvoices, currentUserId)
        res.status(200).json({sellers, permissions: permissions})
    })

    /**
     * Retrieves a seller by their ID.
     * @param {Object} req - request object containing the seller ID in the params
     * @param {Object} res - response object to send the seller details
     * @throws {ServiceError} - throws an error if the seller could not be found
     * @returns {Promise<void>} - returns the seller details in the response
     */
    getSeller = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const {seller} = await this.sellerService.getSeller(id)
        res.status(200).json({seller})
    })

    /**
     * Updates a seller by their ID.
     * @param {Object} req - request object containing the seller ID in the params and updates in the body
     * @param {Number} req.params.id_number -new ID number of the seller
     * @param {String} req.body.name - new name of the seller
     * @param {String} req.body.last_name - new last name of the seller
     * @param {String} req.body.address - new address of the seller
     * @param {Object} res - response object to send the updated seller
     * @throws {ServiceError} - throws an error if the seller could not be updated
     * @returns {Promise<void>} - returns the updated seller in the response
     */
    updateSeller = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const updates = req.body 
        const updatedSeller = await this.sellerService.updateSeller(id, updates)
        res.status(200).json(updatedSeller)
    })

    /**
     * Deletes a seller by their ID.
     * @param {Object} req - request object containing the seller ID in the body
     * @param {Object} res - response object to send a success status
     * @throws {ServiceError} - throws an error if the seller could not be deleted
     * @returns {Promise<void>} - returns a success status in the response
     */
    deleteSeller = this.#error.handler( async(req, res) => {
        const sellerId = req.body.sellerId
        // delete seller 
        await this.sellerService.deleteSeller(sellerId)
        res.status(204).json({})
    })
}

export default SellerController
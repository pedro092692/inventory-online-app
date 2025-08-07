import SellerService from '../services/SellerService.js'
import UserService from '../services/admin/UserService.js'
import controllerErrorHandler from '../errors/controllerErrorHandler.js'

class SellerController {
    // new instance of controller error handler
    #error = new controllerErrorHandler()

    constructor(model) {
        this.sellerService = new SellerService(model)
        this.UserService = new UserService()
        this.#error
    }

    /**
     * Creates a new seller.
     * @param {Object} req - request object containing seller details in the body
     * @param {Object} res - response object to send the created seller
     * @throws {ServiceError} - throws an error if the seller could not be created
     * @returns {Promise<void>} - returns the created seller in the response
     */
    createSeller = this.#error.handler( async(req, res) => {
        // create a user for the seller 
        const { id_number, name, last_name, address, email, password, role_id } = req.body
        const user = await this.UserService.createUser(email, password, role_id, req.user.tenant_id)
        // create seller
        const seller = await this.sellerService.createSeller(id_number, name, last_name, address)
        
        res.status(201).json({seller, user})
    })

    /**
     * Retrieves all sellers.
     * @param {Object} req - request object
     * @param {Object} res - response object to send the list of sellers
     * @throws {ServiceError} - throws an error if the sellers could not be retrieved
     * @returns {Promise<void>} - returns the list of sellers in the response
     */
    allSeller = this.#error.handler(async(req, res) => {
        const sellers = await this.sellerService.getAllSellers()
        res.status(200).json(sellers)
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
        const seller = await this.sellerService.getSeller(id)
        res.status(200).json(seller)
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
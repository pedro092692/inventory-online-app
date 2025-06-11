import CustomerService from "../services/CustomerService.js"
import controllerErrorHandler from "../errors/controllerErrorHandler.js"

class CustomerController {
    #error = new controllerErrorHandler()
    constructor(model) {
        this.customerService = new CustomerService(model)
        this.#error
    }

    /**
     * Creates a new customer.
     * @param {Object} req - request object containing customer details in the body
     * @param {Object} res - response object to send the created customer
     * @throws {ServiceError} - throws an error if the customer could not be created
     * @returns {Promise<void>} - returns the created customer in the response
     */
    createCustomer = this.#error.handler( async(req, res) => {
        const { id_number, name, phone } = req.body
        const newCustomer = await this.customerService.createCustomer(id_number, name, phone)
        res.status(201).json({newCustomer})
    })

    /**
     * Retrieves all customers.
     * @param {Object} req - request object
     * @param {Object} res - response object to send the list of customers
     * @throws {ServiceError} - throws an error if the customers could not be retrieved
     * @returns {Promise<void>} - returns the list of customers in the response
     */
    allCustomers = this.#error.handler( async(req, res) => {
        const customers = await this.customerService.getAllCustomers()
        res.status(200).json(customers)
    })

    /**
     * Retrieves a customer by their ID.
     * @param {Object} req - request object containing the customer ID in the params
     * @param {Object} res - response object to send the customer details
     * @throws {ServiceError} - throws an error if the customer could not be found
     * @returns {Promise<void>} - returns the customer details in the response
     */
    getCustomerById = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const customer = await this.customerService.getCustomerById(id)
        res.status(200).json(customer)
    })

    /**
     * Updates a customer by their ID.
     * @param {Object} req - request object containing the customer ID and updates in the body
     * @param {Object} res - response object to send the updated customer
     * @throws {ServiceError} - throws an error if the customer could not be updated
     * @returns {Promise<void>} - returns the updated customer in the response
     */
    updateCustomer = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const updates = req.body
        const updatedCustomer = await this.customerService.updateCustomer(id, updates)
        res.status(200).json(updatedCustomer)
    })

    /**
     * Deletes a customer by their ID.
     * @param {Object} req - request object containing the customer ID in the body
     * @param {Object} res - response object to send a success status
     * @throws {ServiceError} - throws an error if the customer could not be deleted
     * @returns {Promise<void>} - returns a success status in the response
     */
    deleteCustomer = this.#error.handler( async(req, res) => {
        const customerId = req.body.customerId
        // delete customers 
        await this.customerService.deleteCustomer(customerId)
        res.status(204).json({})
    })
}

export default CustomerController
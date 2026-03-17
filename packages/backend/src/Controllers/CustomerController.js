import CustomerService from '../services/CustomerService.js'
import controllerErrorHandler from '../errors/controllerErrorHandler.js'
import { getUserRole, getUserPermission } from '../middlewares/authorization.js'

class CustomerController {
    #error = new controllerErrorHandler()
    constructor(model, invoiceModel=null) {
        this.customerService = new CustomerService(model, invoiceModel)
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
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const userPermissions = this.userPermissions(req)
        const {customers} = await this.customerService.getAllCustomers(limit, page)
        res.status(200).json({customers, permissions: userPermissions})
    })

    /**
     * Retrieves a customer by their ID.
     * @param {Object} req - request object containing the customer ID in the params
     * @param {Object} res - response object to send the customer details
     * @throws {ServiceError} - throws an error if the customer could not be found
     * @returns {Promise<void>} - returns the customer details in the response
     */
    getCustomerById = this.#error.handler( async(req, res) => {
        const limitInvoices = req.query.limitInvoices ? parseInt(req.query.limitInvoices) : 8
        const offsetInvoices = req.query.offsetInvoices ? parseInt(req.query.offsetInvoices) : 0
        const { id } = req.params
        const {customer, totalInvoices, pageInvoices, pageSizeInvoices} = await this.customerService.getCustomerById(id, limitInvoices, offsetInvoices)
        res.status(200).json({customer, totalInvoices, pageInvoices, pageSizeInvoices})
    })

    /**
     * Searches for customers based on a query string.
     * @param {Object} req - request object containing the search query and pagination parameters
     * @param {Object} res - response object to send the search results
     * @throws {ServiceError} - throws an error if the search operation fails
     * @returns {Promise<void>} - returns the search results in the response
     */
    searchCustomers = this.#error.handler( async(req, res) => {
        const { data } = req.query
        const limitResults = req.query.limitResults ? parseInt(req.query.limitResults) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const userPermissions = this.userPermissions(req)
        const { customers } = await this.customerService.searchCustomers(data, page, limitResults)
        res.status(200).json( { customers, permissions: userPermissions } )
    })

    /**
     * Retrieve the total number of pages for the customers list.
     * * @async
     * @param {import('express').Request} req - Express request object.
     * @param {Object} req.query - Query parameters.
     * @param {string} [req.query.limit] - Max number of items per page (defaults to 10).
     * @param {string} [req.query.data] - Search term to filter results.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>} Sends a JSON response with the total page count.
     */
    totalPages = this.#error.handler( async(req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const { data } = req.query || ''
        const total = await this.customerService.totalPages(data, limit)
        res.status(200).json({total})
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

    
    /**
    * Retrieves the permissions associated with the user's role based on the request.
    * @param {Object} req - The object of the request.
    * @param {Object} req.user - The authenticated user's credentials.
    * @param {string} req.user.role - The user's role (e.g., 'admin', 'editor', 'guest').
    * @returns {Array<string>} A list of strings with the permissions allowed for the role.
    */
    userPermissions(req) {
         const userPermissions = getUserPermission(req.user.role)
         return userPermissions
    }
}

export default CustomerController
const userPermissions = new CustomerController().userPermissions
export { userPermissions }
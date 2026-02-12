import ControllerErrorHandler from '../errors/controllerErrorHandler.js'
import calculeTotalInvoice from '../utils/calculeTotal.js'
import InvoiceService from '../services/InvoiceService.js'

class InvoiceController {
    // error controller new instace 
    #error = new ControllerErrorHandler()
    constructor(model, detailModel=null, productModel=null, dollarModel=null) {
        this.invoiceService = new InvoiceService(model, detailModel, productModel, dollarModel)
        this.#error
    }
    
    /**
     * Creates new invoice
     * @param {Object} req - request object containing the customer, seller ID and details in the body
     * @param {Number} req.details.customer_id - the id of customer for invoice
     * @param {Number} req.details.seller_id - the id of actual seller 
     * @param {Array} req.details - An array of objects with invoice details, keys: product_id, quantity, and unit_price
     * @throws {ServiceError} - throws an error if the invoice could not be created
     * @returns {Promise<void>} - returns a success status in the response if invoice is created.
     */
    createInvoice = this.#error.handler( async(req, res) => {
        const {customer_id, seller_id } = req.body
        const details = req.body.details
        // validate required fields
        if(!customer_id || !seller_id || !details) {
            throw new Error('Customer ID, Seller ID and Details are required')
        }
        
        if(!details || details.length == 0) {
            throw new Error('Details is required, or Details must be a non-empty array')
        }

        const newInvoice = await this.invoiceService.createInvoice(customer_id, seller_id, details)
        
        // add invoice_id to details 
        for(const detail of details) {
            detail['invoice_id'] = newInvoice.id
        }

        // create invoice details
        await this.invoiceService.addInvoiceDetails(details)

        // update total value 
        const total = calculeTotalInvoice(details)

        const updatedInvoice = await this.invoiceService.updateInvoice(newInvoice.id, { total: total})

        res.status(201).json(updatedInvoice)
    })

    /**
     * Retrieves all invoices
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @returns {Promise<void>} - returns a list of all invoices in the response
     * @throws {ServiceError} - throws an error if invoices could not be retrieved
     */
    allInvoices = this.#error.handler( async(req, res) => {
        const invoices = await this.invoiceService.getAllInvoices()
        res.status(200).json(invoices)
    })
    
    /**
     * Retrieves all invoices for the current day
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @returns {Promise<void>} - returns a list of all invoices for the current day in the response
     * @throws {ServiceError} - throws an error if invoices could not be retrieved
     */
    dayInvoices = this.#error.handler( async(req, res) => {
        const dayInvoices = await this.invoiceService.getDayInvoices()
        res.status(200).json(dayInvoices)
    })

    /**
     * Retrieves an invoice by its ID
     * @param {Object} req - request object containing the invoice ID in the params
     * @param {Object} res - response object
     * @returns {Promise<void>} - returns the invoice in the response
     * @throws {ServiceError} - throws an error if the invoice could not be retrieved
     */
    getInvoice = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const invoice = await this.invoiceService.getInvoice(id)
        res.status(200).json(invoice)
    })

    /**
     * Handle HTTP request to search for invoices by ID.
     * * @param {Object} req - Express request object.
     * @param {Object} req.query - Query parameters from the URL.
     * @param {string} req.query.query - The search term for the invoice ID.
     * @param {string|number} [req.query.customer_id] - Optional customer ID to filter results.
     * @param {string} [req.query.limit] - Max number of records to return (parsed to int).
     * @param {string} [req.query.offset] - Number of records to skip (parsed to int).
     * @param {Object} res - Express response object.
     * @returns {Promise<void>} Sends a JSON response with invoices, total count, current page, and pageSize.
     */
    searchInvoicesbyId = this.#error.handler( async(req, res) => {
        const { query } = req.query
        const { customer_id } = req.query
        console.log('customer_id', customer_id)
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const offset = req.query.offset ? parseInt(req.query.offset) : 0
        const { invoices, total, page, pageSize } = await this.invoiceService.searchInvoicesById(query, customer_id ? parseInt(customer_id) : null, limit, offset)
        res.status(200).json({ invoices, total, page, pageSize })
    })

    /**
     * Handle HTTP request to generate a WhatsApp share link for a specific invoice.
     * * @param {Object} req - Express request object.
     * @param {Object} req.params - URL path parameters.
     * @param {string|number} req.params.id - The unique identifier of the invoice to be shared.
     * @param {Object} res - Express response object.
     * @returns {Promise<void>} Sends a JSON response containing the generated WhatsApp URL.
     * @throws {NotFoundError} If the invoice ID does not exist in the database.
     */
    sendWhatsappInvoice = this.#error.handler( async(req, res) => {
        const { id } = req.params
        // get invoice information 
        const invoice = await this.invoiceService.getInvoice(id)
        // create data to be send
        const waLink = await this.invoiceService.invoiceDataForWhatsapp(invoice)
        res.status(200).json({ link: waLink})
    })

    /**
     * Updates an invoice by its ID
     * @param {Object} req - request object containing the invoice ID in the params and updates in the body
     * @param {Object} res - response object
     * @returns {Promise<void>} - returns the updated invoice in the response
     * @throws {ServiceError} - throws an error if the invoice could not be updated
     */
    updateInvoice = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const updates = req.body
        const updatedInvoice = await this.invoiceService.updateInvoice(id, updates)
        res.status(200).json(updatedInvoice)
    })

    /**
     * Deletes an invoice by its ID
     * @param {Object} req - request object containing the invoice ID in the body
     * @param {Object} res - response object
     * @returns {Promise<void>} - returns a success status in the response if the invoice is deleted
     * @throws {ServiceError} - throws an error if the invoice could not be deleted
     */
    deleteInvoice = this.#error.handler( async(req, res) => {
        const invoiceId = req.body.invoiceId
        // delete invoice 
        await this.invoiceService.deleteInvoice(invoiceId)
        res.status(204).json({})
    })

    /**
     * Deletes an invoice detail by its ID
     * @param {Object} req - request object containing the detail ID in the body
     * @param {Object} res - response object
     * @returns {Promise<void>} - returns a success status in the response if the detail is deleted
     * @throws {ServiceError} - throws an error if the detail could not be deleted
     */
    deleteInvoiceDetail = this.#error.handler( async(req, res) => {
        const { id } = req.body
        // delete invoice detail
        await this.invoiceService.deleteInvoiceDetails(id)
        res.status(204).json({})
    })
    
}

export default InvoiceController

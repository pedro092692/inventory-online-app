import InvoiceReturnService from '../services/invoiceReturnService.js'
import ControllerErrorHandler from '../errors/controllerErrorHandler.js'

class InvoiceReturnController {
    #error = new ControllerErrorHandler()
    constructor(invoiceReturnModel) {
        this.invoiceReturn = new InvoiceReturnService(invoiceReturnModel)
        this.#error
    }
    
    /**
    * Controller handler for retrieving paginated returned products of an invoice.
    *
    * @param {import('express').Request} req - The HTTP request object containing query parameters:
    *   - id {number} The invoice ID.
    *   - page {number} The page number for pagination.
    *   - limit {number} The number of items per page.
    * @param {import('express').Response} res - The HTTP response object used to send the JSON result.
    * @returns {Promise<void>} Sends a JSON response containing the returned products.
    *
    * @description
    * This controller extracts pagination parameters from the request query,
    * calls the service method `invoiceReturnedProducts` to fetch the returned
    * products for the specified invoice, and returns the results as JSON.
    * The method is wrapped with the global error handler to ensure consistent
    * error formatting across the application.
    */
    invoiceReturnedProducts = this.#error.handler( async(req, res) => {
        const { id } = req.params || null
        const limit = req.query.limitReturn ? parseInt(req.query.limitReturn) : 8
        const page = req.query.pageReturn ? parseInt(req.query.pageReturn) : 1
        const {returnedProducts} = await this.invoiceReturn.invoiceReturnedProducts(id, page, limit)
        res.status(200).json({returnedProducts})
    })

    /**
     * Retrieve the total number of pages for the invoice returned products.
     * @async
     * @param {import('express').Request} req - Express request object.
     * @param {Object} req.query - Query parameters.
     * @param {string} [req.query.limit] - Max number of items per page (defaults to 5).
     * @param {string} [req.query.id] - The invoice id to filter results.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>} Sends a JSON response with the total page count.
     */
    totalReturnedProductsPages = this.#error.handler( async(req, res) => {
        const id = req.query.id ? parseInt(req.query.id) : null
        const limit = req.query.limit ? parseInt(req.query.limit) : 8
        const total = await this.invoiceReturn.invoiceReturnTotalPages(id, limit)
        res.status(200).json({total})
    })


   
}

export default InvoiceReturnController
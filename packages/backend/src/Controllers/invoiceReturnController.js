import InvoiceReturnService from '../services/invoiceReturnService.js'
import ControllerErrorHandler from '../errors/controllerErrorHandler.js'

class InvoiceReturnController {
    #error = new ControllerErrorHandler()
    constructor(invoiceReturnModel) {
        this.invoiceReturn = new InvoiceReturnService(invoiceReturnModel)
        this.#error
    }
    

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
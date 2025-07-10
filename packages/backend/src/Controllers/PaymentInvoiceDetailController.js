import ControllerErrorHandler from "../errors/controllerErrorHandler.js"
import PayInvoiceService from "../services/PayInvoiceService.js"

class PayInvoiceController {
    // Error hanlder instance 
    #error = new ControllerErrorHandler()

    constructor(model, dollarValueModel=null, invoiceModel=null) {
        this.PayInvoice = new PayInvoiceService(model, dollarValueModel, invoiceModel)
        this.#error
    }

    /**
     * Creates new payment detail for a invoice
     * @param {Object} req - request object containing payment detail in the body
     * @param {Object} res - response object to send the created payment detail info
     * @throws {ServiceError} - throws an error if the payment detail could not be created
     * @returns {Promise<void>} - returns the created payment detail in the response
     */
    createPaymentInvoiceDetail = this.#error.handler( async(req, res) => {
        const { invoice_id, payment_id, amount } = req.body
        const newPaymentDetail = await this.PayInvoice.createPaymentDetail(invoice_id, payment_id, amount)
        res.status(201).json(newPaymentDetail)
    })

    /**
     * Get payment detail of invoice by its ID
     * @param {Object} req - request object containing payment detail id in params
     * @param {Object} res - response object to send the selected payment detail info
     * @throws {ServiceError} - throws an error if the payment detail could not be read
     * @returns {Promise<void>} - returns the seleted payment detail in the response
     */
    getPaymentDetail = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const paymentDetail = await this.PayInvoice.getPaymentInvoiceDetail(id)
        res.status(200).json(paymentDetail)
    })

     /**
     * Updates a payment details by its ID.
     * @param {Object} req - request object containing the payment details ID  in the params and updates in the body
     * @param {Object} res - response object to send the updated payment details
     * @throws {ServiceError} - throws an error if the payment detail could not be updated
     * @returns {Promise<void>} - returns the updated payment detail in the response
     */
    updatePaymentDetail = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const updates = req.body
        const updatedPaymentDetail = await this.PayInvoice.updatePaymentInvoiceDetail(id, updates)
        res.status(200).json(updatedPaymentDetail)
    })

    /**
     * Deletes a payment detail by its ID.
     * @param {Object} req - request object containing the payment details ID in the body
     * @param {Object} res - response object to send a success status
     * @throws {ServiceError} - throws an error if the payment detail could not be deleted
     * @returns {Promise<void>} - returns a success status in the response
     */
    deletePaymentDetail = this.#error.handler( async(req, res) => {
        const payment_detail_id = req.body.payment_detail_id
        // delete payment_detail
        await this.PayInvoice.deletePaymenInvoiceDetail(payment_detail_id)
        res.status(204).json({})
    })
    
}

export default PayInvoiceController
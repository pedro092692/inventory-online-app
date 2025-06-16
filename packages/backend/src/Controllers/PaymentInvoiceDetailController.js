import ControllerErrorHandler from "../errors/controllerErrorHandler"
import PayInvoiceService from "../services/PayInvoiceService"

class PayInvoiceController {
    // Error hanlder instance 
    #error = new ControllerErrorHandler()

    constructor(model) {
        this.PayInvoice = new PayInvoiceService(model)
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
     * 
     */
    getPaymentDetail = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const paymentDetail = await this.PayInvoice.getPaymentInvoiceDetail(id)
        res.status(200).json(paymentDetail)
    })
}

export default PayInvoiceController
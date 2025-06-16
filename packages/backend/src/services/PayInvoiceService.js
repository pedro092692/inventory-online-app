import ServiceErrorHandler from "../errors/ServiceErrorHandler"
import { NotFoundError } from "../errors/NofoundError.js"

class PayInvoiceService {
    // instace of error handler
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.PaymentDetail = model,
        this.#error
    }

    /**
     * Creates new invoicen payment details.
     * @param {number} invoiceId - A id of invoice to paid.
     * @param {number} paymentId - A id of selected payment method.
     * @param {amont} amount - The amount of money paid.
     * @return {Promise<Object>} - A promise that resolves to an object of created invoice payment detail.
     * @throws {ServiceError} - If an error occurs during invoice detail creation.
     */
    createPaymentDetail(invoiceId, paymentId, amount) {
        return this.#error.handler(["Create Payment"], async() => {
            const newPayment = await this.PaymentDetail.create(
                {
                    invoice_id: invoiceId,
                    payment_id: paymentId,
                    amount: amount
                }
            )
            return newPayment
        })
    }

    /**
     * Retrieves an invoice payment detail by its ID.
     * @param {number} id - The ID of the invoice payment detail to retrieve.
     * @return {Promise<Object>} - A promise that resolves to the invoice payment detail object.
     * @throws {ServiceError} - If an error occurs during the retrieval operation.
     */
    getPaymentInvoiceDetail(id) {
        return this.#error.handler(["Read Payment Detail", id, "Pay Invoice"], async() => {
            const paymentDetail = await this.paymentDetail.findByPk(id)
            
            if(!paymentDetail) {
                throw new NotFoundError();       
            }

            return paymentDetail
        })
    }

    /**
     * Updates a invoice payment detail by its ID.
     * @param {number} paymentDetailId - id of the payment invoice detail to update
     * @param {object} updates - object containing the updates to be made
     * @param {number} updates.payment_id - the id of payment method
     * @param {number} updates.amount - the amount of paid money
     * @returns {Promise<Object>} - returns the updated payment detail
     */
    updatePaymentInvoiceDetail(paymentDetailId, updates) {
        return this.#error.handler(
            ["Update Payment Detail", paymentDetailId, "Pay Invoice"], async() => {
                const paymentDetail = await this.getPaymentInvoiceDetail(paymentDetailId)
                const { payment_id, amount } = updates
                const updatedPaymentDetail = await paymentDetail.update({
                    payment_id: payment_id,
                    amount: amount
                })
                return updatedPaymentDetail
        })
    }
}


export default PayInvoiceService
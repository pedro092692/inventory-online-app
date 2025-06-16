import ServiceErrorHandler from "../errors/ServiceErrorHandler"

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
}


export default PayInvoiceService
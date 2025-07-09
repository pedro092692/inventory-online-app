import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import { NotFoundError } from "../errors/NofoundError.js"
import DollarValueService from "./DollarValueService.js"
import InvoiceService from "./InvoiceService.js"

class PayInvoiceService {
    // instace of error handler
    #error = new ServiceErrorHandler()

    constructor(model, dollarValueModel=null, invoiceModel=null) {
        this.PaymentDetail = model,
        this.dollarValue = new DollarValueService(dollarValueModel)
        this.invoiceService = new InvoiceService(invoiceModel)
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
            
            if (paymentId < 1 || paymentId > 7) {
                throw new Error("Payment Id must be between 1 and 7")
            }
            // set reference value 
            let reference_amount = amount            
            
            if( [1,2,3,4].includes(paymentId) ) {
                // get latest dollar value to calcule reference amount
                const dollarValue = await this.dollarValue.getLastValue()
                reference_amount = amount / dollarValue.toJSON().value
                
            }
            const newPayment = await this.PaymentDetail.create(
                {
                    invoice_id: invoiceId,
                    payment_id: paymentId,
                    amount: amount,
                    reference_amount: reference_amount
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
            const paymentDetail = await this.PaymentDetail.findByPk(id)
            
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

    /**
     * Deletes an invoice payment detail by its ID
     * @param {number} paymentDetailId - The ID of the invoice payment detail to delete.
     * @returns {Promise<number>} - Returns a promise that resolves to 1 if the invoice payment detail is successfully deleted.
     * @throws {NotFoundError} - Throws an error if the invoice payment detail is not found.
     */
    deletePaymenInvoiceDetail(paymentDetailId) {
        return this.#error.handler(
            ["Delete Invoice Payment Detail", paymentDetailId, "Pay Invoice"], async() => {
                const paymentDetail = await this.getPaymentInvoiceDetail(paymentDetailId)
                // delete payment details
                await paymentDetail.destroy()
                return 1
            })
    }
}


export default PayInvoiceService
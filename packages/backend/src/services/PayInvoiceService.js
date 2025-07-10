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
        this.invoiceService = new InvoiceService(invoiceModel, null, null, dollarValueModel)
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
            // check if invoice exists
            const invoice = await this._getInvoice(invoiceId)
            const total_to_pay = invoice.total

            
            if (paymentId < 1 || paymentId > 7) {
                throw new Error("Payment Id must be between 1 and 7")
            }

            // set reference value and status
            let reference_amount = amount  
            let status = "unpaid"
            

            if( [1,2,3,4].includes(paymentId) ) {
                // get latest dollar value to calcule reference amount
                const dollarValue = await this.dollarValue.getLastValue()
                reference_amount = amount / dollarValue.toJSON().value

                if( reference_amount > total_to_pay ) {
                    throw new Error("Reference amount cannot be greater than total to pay")
                }

                if( reference_amount == total_to_pay ) {
                    status = "paid"
                }
                
                
            }

            // create payment detail
            await this.PaymentDetail.create(
                {
                    invoice_id: invoiceId,
                    payment_id: paymentId,
                    amount: amount,
                    reference_amount: reference_amount
                }
            )

            // update invoice paid amount and status
            const updatedInvoice = await this._updateInvoice(invoiceId, {
                total_paid: reference_amount,
                status: status
            })
            
            return updatedInvoice
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


    /**
     * This method retrieves an invoice by its ID.
     * It uses the invoiceService to fetch the invoice details.
     * @param {Number} invoiceId 
     * @returns {Promise<Object>} - Returns a promise that resolves to the invoice object.
     * @throws {NotFoundError} - Throws an error if the invoice is not found
     */
    async _getInvoice(invoiceId) {
        const invoice = await this.invoiceService.getSimpleInvoice(invoiceId)
        return invoice
    }

    /**
     * This method updates an invoice with the provided updates.
     * It uses the invoiceService to perform the update operation.
     * @param {Number} invoiceId - The ID of the invoice to be updated.
     * @param {Object} updates - The updates to be applied to the invoice.
     * @returns {Promise<Object>} - Returns a promise that resolves to the updated invoice object.
     */
    async _updateInvoice(invoiceId, updates) {
        const invoice = await this.invoiceService.updateInvoice(invoiceId, updates)
        return invoice
    }
}


export default PayInvoiceService
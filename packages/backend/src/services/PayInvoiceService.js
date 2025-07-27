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
            

            // check if invoice is already paid
            if(invoice.status == "paid") {
                throw new Error("Invoice is already paid")
            }

            let total_to_pay = 0
            const total_paid = parseFloat(invoice.total_paid) || 0.00
            const total = parseFloat(invoice.total)
            
            // calculate total to pay
            if(parseFloat(invoice.total_paid) == 0.00){
                total_to_pay = parseFloat(invoice.total)
            }else{
                total_to_pay = parseFloat((invoice.total - total_paid).toFixed(2))
            }

    
                
            if (paymentId < 1 || paymentId > 7) {
                throw new Error("Payment Id must be between 1 and 7")
            }

            // set reference value, status and change 
            let status = "unpaid"
            const dollarValue = await this.dollarValue.getLastValue()
            
            // check payment method and calculate reference amount
            const { reference_amount, change, detailAmount } = this._checkPaymentMethod(paymentId, dollarValue, amount, total_to_pay)

            // set status based on the amount paid
             if( total_paid + reference_amount >= total ) {
                    status = "paid"
             }

            // create payment detail
            await this.PaymentDetail.create(
                {
                    invoice_id: invoiceId,
                    payment_id: paymentId,
                    amount: detailAmount,
                    reference_amount: reference_amount
                }
            )

            // update invoice paid amount and status
            const updatedInvoice = await this._updateInvoice(invoiceId, {
                total_paid: parseFloat(invoice.total_paid) + reference_amount,
                status: status
            })

            if(change){
                updatedInvoice.dataValues.change = change
            }
            
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
            const paymentDetail = await this.PaymentDetail.findByPk(id, {
                include: [
                    {
                        association: "payments", attributes: ["name"]
                    }
                ]
            })
            
            if(!paymentDetail) {
                throw new NotFoundError();       
            }

            return paymentDetail
        })
    }

    /**
     * Retrieves all invoice payments detail by its ID.
     * @param {number} id - The ID of the invoice payment detail to retrieve.
     * @return {Promise<Array>} - A promise that resolves to the invoice payment detail Array.
     * @throws {ServiceError} - If an error occurs during the retrieval operation.
     */
    getPaymentsInvoice(invoiceId) {
        return this.#error.handler(["Read payments detail", invoiceId, "Read payments details"], async() => {
            const paymentsDetails = await this.PaymentDetail.findAll({
                    where: {
                        invoice_id: invoiceId
                    }
                })

            return paymentsDetails
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
                let reference_amount = paymentDetail.reference_amount

                // check if is needed recalculated reference amount 
                if((parseFloat(paymentDetail.amount) / parseFloat(paymentDetail.reference_amount)) !=1 && amount) {
                    // get dollar value 
                    const dollar_value = await this.dollarValue.getLastValue()
                    // calcule new reference value 
                    
                
                    reference_amount = (amount / parseFloat(dollar_value.value)).toFixed(2)
                    
                }else{ 
                    // calcule new reference amount if payment is in dollar
                    reference_amount = amount
                }
                const updatedPaymentDetail = await paymentDetail.update({
                    payment_id: payment_id,
                    amount: amount,
                    reference_amount: parseFloat(reference_amount)
                })

                // calcule new total paid for current invoice 
                const paymentDetails = await this.getPaymentsInvoice(paymentDetail.invoice_id)
                // calcule total paid 
                const total_paid = this._calculeInvoiceTotalPaid(paymentDetails)

                // update inoivce if it is needed.
                const invoice = await this.invoiceService.getSimpleInvoice(paymentDetail.invoice_id)
                if(total_paid < parseFloat(invoice.total)) {
                    //update invoice
                    await this.invoiceService.updateInvoice(paymentDetail.invoice_id, {status: "unpaid", total_paid: total_paid})
                }   
                
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

                // get invoice details
                const invoice_id = paymentDetail.invoice_id

                // delete payment details
                await paymentDetail.destroy()

                // check if invoice total paid is incompleted
                
                const allPyaments = await this.getPaymentsInvoice(invoice_id)
                const totalPaid = this._calculeInvoiceTotalPaid(allPyaments)
                
                // get invoice 
                const currentInvoice = await this.invoiceService.getSimpleInvoice(invoice_id)
                
                if(totalPaid < parseFloat(currentInvoice.total)) {
                    // update invoice 
                    await this.invoiceService.updateInvoice(invoice_id, {status: "unpaid", total_paid: totalPaid})
                }
                
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

    /**
     * This method checks the payment method and calculates the reference amount, change, and dollar amount
     * based on the payment ID, dollar value, amount, and total to pay.
     * @param {Number} paymentId - The ID of the payment method.
     * @param {Object} dollarValue - The dollar value object containing the current exchange rate
     * @param {Number} amount - The amount of money paid.
     * @param {Number} total_to_pay - The total amount to be paid.
     * @return {Object} - Returns an object containing the reference amount, change, and dollar amount.
     * @throws {Error} - Throws an error if the reference amount is greater than the
     * total to pay or if the payment ID is invalid.
     */
    _checkPaymentMethod(paymentId, dollarValue, amount, total_to_pay) {
        // set default values
        let reference_amount = amount
        let detailAmount = total_to_pay
        let change = 0
        let payment_type = null
        let dollar = dollarValue.toJSON().value

        /**
         * Table of payment methods:
         * 1. point of sale (POS) in bolivars
         * 2. "pago movil" in bolivars
         * 3. transfer in bolivars
         * 4. cash in bolivars
         * 5. cash in dollars
         * 6. trasnfer in dollars
         * 7. cripto currency
         */
        
        // 1 check if payment is in bolivars 
        if( [1, 2, 3, 4].includes(paymentId)) {
            // calculate reference amount
            reference_amount = parseFloat((amount / dollar).toFixed(2))
            detailAmount = amount

            // set payment type to bolivars 
            payment_type = "bolivars"
        }

        // check if reference_amount is greather than total to pay and throw and error
        if((paymentId != 4 && paymentId != 5) && reference_amount > total_to_pay) {
            throw new Error("Reference amount cannot be greater than total to pay")
        }

        //if payment is in cash and greather than total amount calcule change 
        if(paymentId == 4 || paymentId == 5) {
            
            // calcule change if paid amount is greather than total invoice
            if(reference_amount > total_to_pay) {
                change = parseFloat((reference_amount - total_to_pay).toFixed(2))
                // set reference amount in total pay
                reference_amount = total_to_pay
                
                // if payment is in bolivar set amount and change in bolivar 
                if(payment_type == "bolivars") {
                    change = parseFloat((amount - (total_to_pay * dollar)).toFixed(2))
                    detailAmount = parseFloat((total_to_pay * dollar).toFixed(2))
                    reference_amount = parseFloat((detailAmount / dollar).toFixed(2))
                }
            }else {
                // no calcule change 
                detailAmount = reference_amount

                // set detail amount is pament_type is bolivars
                if(payment_type == "bolivars") {
                    detailAmount = amount
                }
            } 
        }

        return {
            reference_amount: reference_amount,
            change: change,
            detailAmount: detailAmount
        }
       
    }


    /**
     * This method check the total amount paid for an specific invoice.
     * @param {Object} details - the object of invoice payment details.
     * @returns {Number} - The total of total paid for specific invoice.
     */
    _calculeInvoiceTotalPaid(details) {
        return details.length > 1 ? details.reduce((accumulator, currentNumber) => {
            return parseFloat(accumulator.reference_amount) + parseFloat(currentNumber.reference_amount)
        }) : parseFloat(details[0].reference_amount)
    }
 
}


export default PayInvoiceService
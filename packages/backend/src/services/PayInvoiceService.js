import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'
import { NotFoundError } from '../errors/NofoundError.js'
import DollarValueService from './DollarValueService.js'
import SellerService from './SellerService.js'
import InvoiceService from './InvoiceService.js'
import AuditLogService from './AuditLogService.js'
import { sequelize } from '../database/database.js'
import hasPassword from '../utils/encrypt.js'

class PayInvoiceService {
    // instace of error handler
    #error = new ServiceErrorHandler()

    constructor(model, dollarValueModel=null, invoiceModel=null, sellerModel=null, auditLogModel=null, invoiceDetailModel=null) {
        this.PaymentDetail = model,
        this.dollarValue = new DollarValueService(dollarValueModel)
        this.invoiceService = new InvoiceService(invoiceModel, invoiceDetailModel, null, dollarValueModel)
        this.sellerService = new SellerService(sellerModel)
        this.auditLogService = new AuditLogService(auditLogModel)
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
    createPaymentDetail(invoiceId, payments = []) {
        return this.#error.handler(['Create Payment'], async() => {

            //1 check if invoice exists
            const invoice = await this._getInvoice(invoiceId)

            //2 check if invoice is already paid
            if(invoice.status == 'paid') {
                throw new Error('Invoice is already paid')
            }

            //3 check if payment array is not empty
            if (!payments || payments.length === 0) {
                throw new Error('No pyaments provided')
            }

            const total = parseFloat(invoice.total)
            let total_paid = parseFloat(invoice.total_paid) || 0.00
            let total_reference = 0
            let total_change = 0

            const dollarValue = await this.dollarValue.getLastValue()
            const detailsToCreate = []

            // iterate over each payment
            for (const payment of payments) {
                const { paymentId, amount } = payment

                if (paymentId < 1 || paymentId > 8) {
                    throw new Error(`Payment Id must be between 1 and 8. Received: ${paymentId}`)
                }

                // Dynamically recalculate the remaining balance to be paid in USD in this iteration
                let total_to_pay = parseFloat((total - total_paid).toFixed(2))
            
                // If for some reason the total was already covered in a previous loop, ignore or handle extra change
                if (total_to_pay <= 0) total_to_pay = 0

                // Evaluate the current payment method and calculate reference amounts/changes.
                const { reference_amount, change, detailAmount } = this._checkPaymentMethod(
                    paymentId, 
                    dollarValue, 
                    parseFloat(amount), 
                    total_to_pay
                )

                // Collect the change if the method generated one (e.g., cash)
                if (change) {
                    total_change = parseFloat((total_change + parseFloat(change)).toFixed(2))
                }

                // Accumulate the amount paid in dollars cleanly
                total_paid = parseFloat((total_paid + reference_amount).toFixed(2))

                // Save data in memory for later storage
                detailsToCreate.push({
                    invoice_id: invoiceId,
                    payment_id: paymentId,
                    amount: detailAmount,
                    reference_amount: reference_amount
                })
            }
            
            //4. Determine the final invoice status after processing all payments
            let status = 'unpaid'
            if (total_paid >= total) {
                status = 'paid'
                total_reference = (total * parseFloat(dollarValue.value)).toFixed(2)
            }

            // 5. Register all details in the database, either in bulk or one by one.
            for (const detail of detailsToCreate) {
                await this.PaymentDetail.create(detail)
            }

            // 6. Update paid amount and invoice final status.
                const updatedInvoice = await this._updateInvoice(invoiceId, {
                total_paid: total_paid,
                total_reference: total_reference,
                status: status
            })

            // 7. If there was a return, attach it to the response for the Frontend.
            if (total_change > 0) {
                updatedInvoice.invoice.dataValues.change = total_change.toFixed(2)
            }  
            
            // 8. If it remains unpaid, calculate how much is still owed in the reference currency (Bs)
            if (updatedInvoice?.invoice?.status == 'unpaid') {
                updatedInvoice.invoice.dataValues.total_to_pay_reference = (
                parseFloat(updatedInvoice.invoice.dataValues.total_to_pay_dollar) * parseFloat(updatedInvoice.invoice.dataValues.exchange_rate)
                ).toFixed(2)
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
    getPaymentInvoiceDetail(id, options = {}) {
        return this.#error.handler(['Read Payment Detail', id, 'Pay Invoice'], async() => {
            const paymentDetail = await this.PaymentDetail.findByPk(id, {
                include: [
                    {
                        association: 'payments', attributes: ['name']
                    }
                ]
            },
            {
                transaction: options.transaction
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
        return this.#error.handler(['Read payments detail', invoiceId, 'Read payments details'], async() => {
            const paymentsDetails = await this.PaymentDetail.findAll({
                    where: {
                        invoice_id: invoiceId,
                        status: 'active'
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
     * @param {string} updates.status - Optional the status of payment detail
     * @returns {Promise<Object>} - returns the updated payment detail
     */
    updatePaymentInvoiceDetail(paymentDetailId, updates) {
        return this.#error.handler(
            ['Update Payment Detail', paymentDetailId, 'Pay Invoice'], async() => {
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
                    await this.invoiceService.updateInvoice(paymentDetail.invoice_id, {status: 'unpaid', total_paid: total_paid})
                }else{
                    await this.invoiceService.updateInvoice(paymentDetail.invoice_id, {status: 'paid', total_paid: total_paid})
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
            ['Delete Invoice Payment Detail', paymentDetailId, 'Pay Invoice'], async() => {
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
                    await this.invoiceService.updateInvoice(invoice_id, {status: 'unpaid', total_paid: totalPaid})
                }
                
                return 1
            })
    }

    /**
     * Cancels an invoice payment detail by its ID
     * @param {number} paymentDetailId - The ID of the invoice payment detail to cancel.
     * @param {boolean} pinIsRequired - Indicates whether a supervisor PIN is required for cancellation (default: true).
     * @param {string|null} pin - The supervisor PIN for authorization (required if pinIsRequired is true).
     * @param {number|null} currentUserId - The ID of the user performing the cancellation (optional).
     * @returns {Promise<Object>} - Returns a promise that resolves to the updated invoice object.
     * @throws {NotFoundError} - Throws an error if the invoice payment detail is not found.
     */
    cancelPaymentInvoiceDetail(paymentDetailId, pinIsRequired = true,  pin = null, currentUser = {id: null, tenant_id: null}) {
        return this.#error.handler(['Cancel Invoice Payment Detail', paymentDetailId, 'Pay Invoice'], async() => {
            
            const hashedPin = pinIsRequired ? hasPassword(pin, String(currentUser.tenant_id)) : null
            //

            const t = await sequelize.transaction()
            try {
                //1. check if user is authorized to cancel payment detail and get authorized user info if pin is required
                const authorizedBy = pinIsRequired ? await this.sellerService.authorizeSeller(hashedPin, { transaction: t }) : null
                
                //2. get actual payment detail 
                const paymentDetail = await this.getPaymentInvoiceDetail(paymentDetailId, {transaction: t})
                
                // check if payment detail is already cancelled
                if (paymentDetail.status === 'void') throw new Error('Payment detail is already cancelled')
                const oldSnapshot = paymentDetail.toJSON()

                //3. cancel payment detail (update status to void)
                await paymentDetail.update({ status: 'void'}, {transaction: t})
                const newSnapshot = paymentDetail.toJSON()

                const invoice_id = paymentDetail.invoice_id
                
                //4. recalcule total paid for current invoice and update invoice status if it is needed
                await this._recalculeInvoiceTotalPaid(invoice_id, {transaction: t})

                //5 create audit log of cancelled payment detail
                await this.auditLogService.createAuditLog({
                    action: 'CANCEL_PAYMENT',
                    tableName: 'payment_details',
                    recordId: paymentDetailId,
                    details: {oldSnapshot, newSnapshot},
                    userId: currentUser.id,
                    supervisor_seller_id: authorizedBy?.authorizedBy?.id || null
                }, {transaction: t})
                
                await t.commit()

                return {invoice: await this.invoiceService.getSimpleInvoice(invoice_id)}
            
            }catch(error) {
                await t.rollback()
                throw error
            }
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
            payment_type = 'bolivars'
        }

        // check if reference_amount is greather than total to pay and throw and error
        if((paymentId != 4 && paymentId != 5) && reference_amount > total_to_pay) {
            throw new Error('Reference amount cannot be greater than total to pay')
        }

        //if payment is in cash and greather than total amount calcule change 
        if(paymentId == 4 || paymentId == 5) {
            
            // calcule change if paid amount is greather than total invoice
            if(reference_amount > total_to_pay) {
                change = parseFloat((reference_amount - total_to_pay).toFixed(2))
                // set reference amount in total pay
                reference_amount = total_to_pay
                
                // if payment is in bolivar set amount and change in bolivar 
                if(payment_type == 'bolivars') {
                    change = parseFloat((amount - (total_to_pay * dollar)).toFixed(2))
                    detailAmount = parseFloat((total_to_pay * dollar).toFixed(2))
                    reference_amount = parseFloat((detailAmount / dollar).toFixed(2))
                }
            }else {
                // no calcule change 
                detailAmount = reference_amount

                // set detail amount is pament_type is bolivars
                if(payment_type == 'bolivars') {
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
        
        const initialValue = 0
        return details.length > 1 ? details.reduce((accumulator, currentNumber) => {
            return accumulator + parseFloat(currentNumber.reference_amount)
        }, initialValue) : parseFloat(details[0]?.reference_amount || 0.00)
    }

    /**
     * This method check the total amount active paid amount for an specific invoice.
     * @param {Number} invoice_id - the ID of the invoice.
     * @param {Object} options - the options for the query.
     * @returns {Object} - The active payments for the specific invoice.
     */
    getInvoiceActivePayments(invoice_id, options = {}) {
        return this.#error.handler(['Read Active Payments of Invoice', invoice_id, 'Pay Invoice'], async() => {
            const activePayments = await this.PaymentDetail.findAll({
                where: {
                    invoice_id: invoice_id,
                    status: 'active'
                },
                transaction: options.transaction || null
            })
            
            return {
                activePayments: activePayments
            }
        })
    }

    /**
     * This method recalculates the total amount paid for an specific invoice and updates its status if necessary.
     * @param {Number} invoice_id - the ID of the invoice.
     * @param {Object} options - the options for the query.
     * @returns {Void} - This method does not return anything, but it updates the invoice status to 
     * 'unpaid' if the total paid is less than the invoice total.
     */
    async _recalculeInvoiceTotalPaid(invoice_id, options = {}) {
        const allPayments = await this.getInvoiceActivePayments(invoice_id, {transaction: options.transaction || null})
        const totalPaid = this._calculeInvoiceTotalPaid(allPayments.activePayments)
        const currentInvoice = await this.invoiceService.getSimpleInvoice(invoice_id, {transaction: options.transaction || null})
        
        if(totalPaid < parseFloat(currentInvoice.total)) {
            await this.invoiceService.updateInvoice(
                invoice_id, 
                {
                    status: 'unpaid', 
                    total_paid: parseFloat(totalPaid).toFixed(2)
                }
            )
        }
    }
 
}


export default PayInvoiceService
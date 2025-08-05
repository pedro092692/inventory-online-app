import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'
import { NotFoundError } from '../errors/NofoundError.js'


class PaymentMethodService {
    // Error handler instante 
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.PaymentMethod = model
        this.#error
    }

    /**
     * 
     * @param {String} name - Name of payment method E.g bank tranfer 
     * @param {String} currency - Name of currency of payment method E.g Dollar  
     * @returns {Promise<object>} - A object with data of new payment method
     * @throws {Error} - Throws an error if create payment fails.
     */
    cretePaymentMethod(name, currency) {
        return this.#error.handler(['Create Payment Method'], async() => {
            const newPayment = await this.PaymentMethod.create({
                name: name, 
                currency: currency
            })

            console.log(newPayment)

            return newPayment
        })
    }

    /**
     * 
     * @param {Number} id - Id of the payment method 
     * @returns {Promise<object>}  A object with data of new payment method
     * @throws {Error} - Throws an error if get payment method fails.
     */
    getPaymentMethod(id) {
        return this.#error.handler(['Read Payment Method', id, 'Payment'], async() => {
            const paymentMethod = await this.PaymentMethod.findByPk(id)
            
            if(!paymentMethod) {
                throw new NotFoundError()
            }

            return paymentMethod
        })
    }

    /**
     * Retrieves all Payment Methods with pagination.
     * @param {Number} limit - limit of payment methods to return
     * @param {Number} offset - offset of payment methods to return
     * @returns {Promise<Array>} - returns an array of payment methods
     * @throws {ServiceError} - throws an error if the payment methods could not be retrieved
     */
    getAllPaymentMethods(limit=10, offset=0) {
        return this.#error.handler(['Read All Payment Methods'], async() => {
            const allMethods = await this.PaymentMethod.findAll({
                limit: limit,
                offset: offset
            })

            return allMethods
        })
    }

    /**
     * Updates a Payment Methods by its ID.
     * @param {Number} PaymentMethodId - id of the payment method to update
     * @param {Object} updates - object containing the updates to be made
     * @param {String} updates.name - name of the payment method
     * @param {String} updates.currency - name of the currency of the payment method
     * @returns {Promise<Object>} - returns the updated Payment Method
     */
    updatePaymentMethod(paymentMethodId, updates) {
        return this.#error.handler(['Update payment method', paymentMethodId, 'Payment Method'], async() => {
            const paymentMethod = await this.getPaymentMethod(paymentMethodId)
            const updatedPaymentMethod = await paymentMethod.update(updates)
            return updatedPaymentMethod
        })
    }

    /**
     * Deletes a payment methods by its ID.
     * @param {Number} paymentMethodId - id of the  payment method to delete
     * @returns {Promise<Number>} - returns 1 if the  payment method was deleted successfully
     * @throws {ServiceError} - throws an error if the  payment method could not be deleted
     */
    deletePaymentMethod(paymentMethodId) {
        return this.#error.handler(['Delete Payment Method', paymentMethodId, 'Payment Method'], async() => {
            // get payment methods
            const paymentMethod = await this.getPaymentMethod(paymentMethodId)

            // delete payment method
            await paymentMethod.destroy()
            return 1
        })
    }
}

export default PaymentMethodService
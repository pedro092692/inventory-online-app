import ServiceErrorHandler from "../errors/ServiceErrorHandler"
import { NotFoundError } from "../errors/NofoundError"


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
        return this.#error.handler(["Create Payment Method"], async() => {
            const newPayment = await this.PaymentMethod.create({
                name: name, 
                currency: currency
            })

            return newPayment
        })
    }

    /**
     * 
     * @param {Number} id - Id of the payment method 
     * @returns {Promise<object}  A object with data of new payment method
     * @throws {Error} - Throws an error if get payment method fails.
     */
    getPaymentMethod(id) {
        return this.#error.handler(["Read Payment Method", id, "Payment"], async() => {
            const paymentMethod = await this.PaymentMethod.findByPk(id)
            
            if(!paymentMethod) {
                throw new NotFoundError()
            }

            return paymentMethod
        })
    }
}

export default PaymentMethodService
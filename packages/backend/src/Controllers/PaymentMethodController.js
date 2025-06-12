import ControllerErrorHandler from "../errors/controllerErrorHandler"
import PaymentMethodService from "../services/PaymentMethodService"

class PaymentMethodController {
    // Error handler instance 
    #error = new ControllerErrorHandler()

    constructor(model) {
        this.PaymentMethod = new PaymentMethodService(model)
        this.#error
    }

    /**
     * Creates a new Payment Method.
     * @param {Object} req - request object containing payment method in the body
     * @param {Object} res - response object to send the created payment method
     * @throws {ServiceError} - throws an error if the payment method could not be created
     * @returns {Promise<void>} - returns the created payment method in the response
     */
    createPaymentMethod = this.#error.handler( async(req, res) => {
        const { name, currency } = req.body
        const newPaymentMethod = await this.PaymentMethod.cretePaymentMethod(name, currency)
        res.status(201).json(newPaymentMethod)
    })

    /**
     * Retrieves a payment method by its ID.
     * @param {Object} req - request object containing the payment method ID in the params
     * @param {Object} res - response object to send the payment method details
     * @throws {ServiceError} - throws an error if the payment method could not be found
     * @returns {Promise<void>} - returns the payment method details in the response
     */
    getPaymentMethod = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const paymentMethod = await this.PaymentMethod.getPaymentMethod(id)
        res.status(200).json(paymentMethod)
    })
}
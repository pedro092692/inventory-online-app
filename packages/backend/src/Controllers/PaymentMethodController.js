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
}
import ControllerErrorHandler from '../errors/controllerErrorHandler.js'
import PaymentMethodService from '../services/PaymentMethodService.js'

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

    /**
     * Retrieves all payment methods.
     * @param {Object} req - request object
     * @param {Object} res - response object to send the list of payment methods
     * @throws {ServiceError} - throws an error if the payment methods could not be retrieved
     * @returns {Promise<void>} - returns the list of payment methods in the response
     */
    getAllProducts = this.#error.handler( async(req, res) => {
        const allPaymentMethods = await this.PaymentMethod.getAllPaymentMethods()
        res.status(200).json(allPaymentMethods)
    })

    /**
     * Updates a payment method by its ID.
     * @param {Object} req - request object containing the payment method in the params ID and updates in the body
     * @param {Object} res - response object to send the updated payment method
     * @throws {ServiceError} - throws an error if the payment method could not be updated
     * @returns {Promise<void>} - returns the updated payment method in the response
     */
    updatePaymentMethod = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const  updates  = req.body
        const updatedPaymentMethod = await this.PaymentMethod.updatePaymentMethod(id, updates)
        res.status(200).json(updatedPaymentMethod)
    })

    /**
     * Deletes a payment method by its ID.
     * @param {Object} req - request object containing the payment method ID in the body
     * @param {Object} res - response object to send a success status
     * @throws {ServiceError} - throws an error if the payment method could not be deleted
     * @returns {Promise<void>} - returns a success status in the response
     */
    deletePaymentMethod = this.#error.handler( async(req, res) => {
        const paymentMethodId = req.body.paymentMethodId
        // delete payment method
        await this.PaymentMethod.deletePaymentMethod(paymentMethodId)
        res.status(204).json({})
    })
}

export default PaymentMethodController
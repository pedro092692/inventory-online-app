import StoreStatusService from '../services/StoreStatusService.js'
import SubscriptionPaymentService from '../services/SubscriptionPaymentService.js'
import ControllerErrorHandler from '../errors/controllerErrorHandler.js'

class StoreStatusController {
    #error = new ControllerErrorHandler()

    constructor() {
        this.storeStatus = new StoreStatusService()
        this.payments = new SubscriptionPaymentService()
        this.#error
    }

    /**
     * Retrieves the active status of the current user's store (active/inactive + reason).
     * @param {Object} req - request object, uses the authenticated user's tenant_id
     * @param {Object} res - response object to send the store status
     * @throws {ServiceError} - throws an error if the status could not be retrieved
     * @returns {Promise<void>} - returns {active, reason} in the response
     */
    getStatus = this.#error.handler( async(req, res) => {
        const tenantId = req.user?.tenant_id
        const status = await this.storeStatus.getStatus(tenantId)
        res.status(200).json(status)
    })

    /**
     * Retrieves the current store owner's own store profile, health stats, and the
     * amount currently due (in Bs) for the next subscription renewal.
     * @param {Object} req - request object, uses the authenticated user's tenant_id
     * @param {Object} res - response object to send the store overview
     * @throws {ServiceError} - throws an error if the overview could not be retrieved
     * @returns {Promise<void>} - returns {store, stats, amountDueUsd, amountDueBs, exchangeRate}
     */
    getMyStore = this.#error.handler( async(req, res) => {
        const tenantId = req.user?.tenant_id
        const overview = await this.payments.getMyStoreOverview(tenantId)
        res.status(200).json(overview)
    })

    /**
     * Submits a subscription payment receipt for admin review.
     * @param {Object} req - request object, expects `amount` in the body and a `receipt` file (multer)
     * @param {Object} res - response object to send the created payment
     * @throws {ServiceError} - throws an error if the payment could not be submitted
     * @returns {Promise<void>} - returns the created SubscriptionPayment
     */
    submitPayment = this.#error.handler( async(req, res) => {
        const tenantId = req.user?.tenant_id
        const { amount } = req.body
        const payment = await this.payments.submitPayment(tenantId, amount, req.file)
        res.status(201).json(payment)
    })

    /**
     * Retrieves the current store owner's own submitted subscription payments.
     * @param {Object} req - request object, uses the authenticated user's tenant_id
     * @param {Object} res - response object to send the payments list
     * @throws {ServiceError} - throws an error if the payments could not be retrieved
     * @returns {Promise<void>} - returns {payments}
     */
    getMyPayments = this.#error.handler( async(req, res) => {
        const tenantId = req.user?.tenant_id
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const payments = await this.payments.getMyPayments(tenantId, limit, page)
        res.status(200).json({ payments })
    })
}

export default StoreStatusController

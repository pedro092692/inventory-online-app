import ExchangeRateService from '../../services/admin/ExchangeRateService.js'
import ControllerErrorHandler from '../../errors/controllerErrorHandler.js'

class ExchangeRateController {
    // new instance of controller error handler
    #error = new ControllerErrorHandler()

    constructor() {
        this.exchangeRate = new ExchangeRateService()
        this.#error
    }

    /**
     * Registers a new platform exchange rate.
     * @param {Object} req - request object containing `value` in the body
     * @param {Object} res - response object to send the created rate
     * @throws {ServiceError} - throws an error if the rate could not be created
     * @returns {Promise<void>} - returns the created rate
     */
    createRate = this.#error.handler( async(req, res) => {
        const { value } = req.body
        const rate = await this.exchangeRate.createRate(value)
        res.status(201).json({ rate })
    })

    /**
     * Retrieves the current (most recently registered) exchange rate.
     * @param {Object} req - request object
     * @param {Object} res - response object to send the current rate
     * @throws {ServiceError} - throws an error if the rate could not be retrieved
     * @returns {Promise<void>} - returns { rate } (rate is null if none has been set yet)
     */
    getLastRate = this.#error.handler( async(req, res) => {
        const rate = await this.exchangeRate.getLastRate()
        res.status(200).json({ rate })
    })

    /**
     * Retrieves a single exchange rate entry by its ID.
     * @param {Object} req - request object containing the rate ID in the params
     * @param {Object} res - response object to send the rate
     * @throws {ServiceError} - throws an error if the rate could not be found
     * @returns {Promise<void>} - returns the rate
     */
    getRate = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const rate = await this.exchangeRate.getRate(id)
        res.status(200).json({ rate })
    })

    /**
     * Retrieves the exchange rate history with pagination.
     * @param {Object} req - request object with optional limit/page query params
     * @param {Object} res - response object to send the rate history
     * @throws {ServiceError} - throws an error if the history could not be retrieved
     * @returns {Promise<void>} - returns {rates, total, totalPages}
     */
    getAllRates = this.#error.handler( async(req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const { rates, total } = await this.exchangeRate.getAllRates(limit, page)
        res.status(200).json({ rates, total, totalPages: Math.ceil(total / limit) || 1 })
    })

    /**
     * Updates an exchange rate entry by its ID.
     * @param {Object} req - request object containing the rate ID in the params and `value` in the body
     * @param {Object} res - response object to send the updated rate
     * @throws {ServiceError} - throws an error if the rate could not be updated
     * @returns {Promise<void>} - returns the updated rate
     */
    updateRate = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const { value } = req.body
        const rate = await this.exchangeRate.updateRate(id, value)
        res.status(200).json({ rate })
    })

    /**
     * Deletes an exchange rate entry. Takes the id from the body (not the URL) to match
     * the app's existing generic delete flow (DeleteResource / Actions / DeleteModal).
     * @param {Object} req - request object containing the rate ID in the body
     * @param {Object} res - response object to send a success status
     * @throws {ServiceError} - throws an error if the rate could not be deleted
     * @returns {Promise<void>} - returns a confirmation message
     */
    deleteRate = this.#error.handler( async(req, res) => {
        const { id } = req.body
        await this.exchangeRate.deleteRate(id)
        res.status(200).json({ message: 'Tasa de cambio eliminada' })
    })
}

export default ExchangeRateController

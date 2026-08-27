import { NotFoundError } from '../../errors/NofoundError.js'
import ServiceErrorHandler from '../../errors/ServiceErrorHandler.js'
import { PlatFormExchangeRate } from '../../models/PlatformExchangeRateModel.js'

/**
 * Manages the platform-wide USD → Bs exchange rate used to calculate how much (in Bs) a
 * store owner owes for their subscription (see SubscriptionPaymentService, which reads
 * the most recent rate to compute `amountDueBs` / `amount_expected`).
 *
 * This is effectively an append-only history: registering a new rate never implicitly
 * touches a past one — "the current rate" is simply whichever row was created most
 * recently (highest id). Editing/deleting a past row is still exposed here (to correct a
 * mistake), and it's safe to do so because SubscriptionPayment stores its own
 * `amount_expected` snapshot at submission time rather than a live reference to this table
 * — changing history here does not retroactively change what a past payment expected.
 */
class ExchangeRateService {
    // new instance of service error handler
    #error = new ServiceErrorHandler()

    constructor() {
        this.#error
    }

    /**
     * Registers a new exchange rate. Becomes the current rate used for future subscription
     * charges (does not affect payments already submitted — those keep their own snapshot).
     * @param {number} value - Bs per USD.
     * @returns {Promise<Object>} The created rate row.
     */
    createRate(value) {
        return this.#error.handler(['Create exchange rate'], async () => {
            const rate = await PlatFormExchangeRate.create({
                value,
                date: new Date()
            })
            return rate
        })
    }

    /**
     * Retrieves the current (most recently registered) exchange rate.
     * @returns {Promise<Object|null>} The latest rate row, or null if none has been set yet.
     */
    getLastRate() {
        return this.#error.handler(['Read latest exchange rate'], async () => {
            const rate = await PlatFormExchangeRate.findOne({ order: [['id', 'DESC']] })
            return rate
        })
    }

    /**
     * Retrieves a single exchange rate entry by its ID.
     * @param {number} id
     * @returns {Promise<Object>}
     * @throws {NotFoundError} If it does not exist.
     */
    getRate(id) {
        return this.#error.handler(['Read exchange rate', id, 'PlatformExchangeRate'], async () => {
            const rate = await PlatFormExchangeRate.findByPk(id)
            if (!rate) {
                throw new NotFoundError()
            }
            return rate
        })
    }

    /**
     * Retrieves the exchange rate history, most recent first, along with the total count
     * (for paginating the list on the frontend).
     * @param {number} [limit=10]
     * @param {number} [page=1]
     * @returns {Promise<Object>} { rates, total }
     */
    getAllRates(limit = 10, page = 1) {
        const offset = (page - 1) * limit
        return this.#error.handler(['Read exchange rate history'], async () => {
            const [rates, total] = await Promise.all([
                PlatFormExchangeRate.findAll({
                    order: [['id', 'DESC']],
                    limit,
                    offset
                }),
                PlatFormExchangeRate.count()
            ])
            return { rates, total }
        })
    }

    /**
     * Updates a past exchange rate entry (e.g. to correct a typo). Safe to do — see the
     * class-level note on why this doesn't retroactively affect past payments.
     * @param {number} id
     * @param {number} value
     * @returns {Promise<Object>} The updated rate row.
     * @throws {NotFoundError} If it does not exist.
     */
    updateRate(id, value) {
        return this.#error.handler(['Update exchange rate', id, 'PlatformExchangeRate'], async () => {
            const rate = await this.getRate(id)
            const updatedRate = await rate.update({ value })
            return updatedRate
        })
    }

    /**
     * Deletes an exchange rate entry (e.g. one created by mistake).
     * @param {number} id
     * @returns {Promise<number>} 1 if deleted.
     * @throws {NotFoundError} If it does not exist.
     */
    deleteRate(id) {
        return this.#error.handler(['Delete exchange rate', id, 'PlatformExchangeRate'], async () => {
            const rate = await this.getRate(id)
            // delete rate
            await rate.destroy()
            return 1
        })
    }
}

export default ExchangeRateService

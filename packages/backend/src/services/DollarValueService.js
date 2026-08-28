import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'
import { NotFoundError } from '../errors/NofoundError.js'

class DollarValueService {
    
    // Service Error handler instance 
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.DollarValue = model
        this.#error
    }

    /**
     * 
     * @param {number} value - The value of the current dollar price.
     * @return {Promise<Object>} - A promise that resolves to an object of created new dollar value price.
     * @throws {ServiceError} - If an error occurs during create dollar value.
     */
    createDollarValue(value) {
        return this.#error.handler(['Create Dollar Value'], async() => {
            const newDollarValue = await this.DollarValue.create({
                value
            })
            return newDollarValue
        })
    }

    /**
     * Retrieves a dollar value by its ID.
     * @param {Number} id - id of the dollar value to retrieve
     * @returns {Promise<Object>} - returns the dollar value with the given id
     * @throws {ServiceError} - throws an error if the dollar value could not be retrieved
     */
    getDollarValue(id) {
        return this.#error.handler(['Read Dollar Value', id, 'Dollar Value'], async() => {
            const dollarValue = await this.DollarValue.findByPk(id) 
            
            if(!dollarValue) {
                throw new NotFoundError()
            }

            return dollarValue
        })
    }

    /**
     * Retrieves all currency history data with pagination.
     * @param {Number} limit - limit of data to return
     * @param {Number} offset - offset of data to return
     * @returns {Promise<Array>} - returns an array of data
     * @throws {ServiceError} - throws an error if the data could not be retrieved
     */
    getAllData(limit = 10, page = 1) {
        const offset = (page - 1) * limit
        return this.#error.handler(['Read All Products'], async () => {
            const data = await this.DollarValue.findAll({
                attributes: ['date', 'value', 'id'],
                order: [['id', 'DESC']],
                limit: limit,
                offset: offset
            })

            return {
                currencyData: data
            }
        })    
    }

    /**
     * Retrieves the "effective" exchange rate to use for pricing/payments: the store's
     * "tasa colchón" (buffer rate) when it has one active, otherwise the true official
     * rate — same as `getLastValue()` would return.
     *
     * This is the single choke point ProductService/InvoiceService/PayInvoiceService call
     * instead of `getLastValue()` when computing a Bs amount that will actually be shown or
     * charged, so the buffer (once enabled) applies consistently everywhere: product
     * catalog, cart, invoices, and Bs payment collection. USD-denominated payments never
     * go through here at all, so they're unaffected by construction, not by special-casing.
     *
     * @param {Object|null} [storeSettingsModel] - the tenant's StoreSettings model. When
     * omitted, this just behaves like `getLastValue()`.
     * @returns {Promise<Object|false>} - an object shaped like the Dollar model (`.value`,
     * `.toJSON()`) so it's a drop-in replacement at existing call sites; `official_value` is
     * also included for callers that want to show/compare against the true rate. `false` if
     * no official rate has been set yet.
     * @throws {ServiceError} - throws an error if the rate could not be retrieved.
     */
    getEffectiveValue(storeSettingsModel = null) {
        return this.#error.handler(['Read Effective Dollar Value'], async () => {
            const officialValue = await this.getLastValue()

            if (!officialValue) {
                return false
            }

            const officialRate = parseFloat(officialValue.value)
            let effectiveRate = officialRate

            if (storeSettingsModel) {
                const settings = await storeSettingsModel.findOne({ where: { id: 1 } })
                const bufferRate = parseFloat(settings?.buffer_rate)
                // Only use the buffer while it's still actually a "cushion" above the official
                // rate. If the official rate has since caught up or passed it, the buffer would
                // undercharge (selling below the real dollar value), so silently fall back to
                // the official rate instead — see getBufferStatus() for the owner-facing warning.
                if (settings?.buffer_enabled && bufferRate && bufferRate > officialRate) {
                    effectiveRate = bufferRate
                }
            }

            const result = {
                value: effectiveRate,
                official_value: officialRate
            }
            result.toJSON = () => result

            return result
        })
    }

    /**
     * Retrieves a dollar last dollar value.
     * @returns {Promise<Object>} - returns the last dollar value.
     * @throws {ServiceError} - throws an error if the last dollar value could not be retrieved
     */
    getLastValue() {
        return this.#error.handler(['Read Last Dollar Value'], async() => {
            const lastDollarValue = await this.DollarValue.findOne({
                order: [ ['id', 'DESC'] ],
                limit: 1
            })

            if(!lastDollarValue) {
                return false
            }

            return lastDollarValue
        })
    }

    /**
     * Retrieves a currency by their ID.
     * @param {number} id - The ID of the currency to retrieve.
     * @return {Promise<Object>} - A promise that resolves to the currency object.
     * @throws {NotFoundError} - If the currency is not found.
     * @throws {ServiceError} - If an error occurs during currency retrieval.
     */
    getDataById(id) {
        return this.#error.handler(['Read Customer', id, 'Customer'], async () => {
            const data = await this.DollarValue.findByPk(id, {
                attributes: [
                    'date',
                    'value',
                    'id'
                ],
            })
            if (!data) {
                throw new NotFoundError()
            }
            return {
                currencyData: data
            }
        })
    }


    /**
     * Calculates the total number of pages for currency history based on a limit.
     * @param {number} [limit=10] - The number of records to display per page.
     * @returns {Promise<number>} A promise that resolves to the total number of calculated pages.
     * @throws Will be handled by the internal error handler.
     */
    totalPages(limit = 10) {
        return this.#error.handler(['Total pages', limit, 'Dollar value'], async () => {
            const count = await this.DollarValue.count()
            return Math.ceil(count / limit)
        })
    }

    /**
     * Update a Dollar vaule by its ID
     * @returns {Promise<Object>} - returns the updated dollar value.
     * @throws {ServiceError} - throws an error if the dollar value could not be updated
     */
    updateDollarValue(id, value) {
        return this.#error.handler(['Update Dollar Value', id, 'Dollar Value'], async() => {
            const dollarValue = await this.getDollarValue(id)
            const updatedDollarValue = await dollarValue.update({
                value: value, 
                date: new Date()
            })
            return updatedDollarValue
        })
    }

    /**
     * Delete a dollar value by its ID
     * @returns {Promise<Object>} - returns 1 if the dollar value is deleted.
     * @throws {ServiceError} - throws an error if the dollar value could not be deleted.
     */
    deleteDollarValue(id) {
        return this.#error.handler(['Delete Dollar Value', id, 'Dollar Value'], async() => {
            const dollarValue = await this.getDollarValue(id)
            // delete dollar value
            await dollarValue.destroy()
            return 1
        })
    }

}


export default DollarValueService
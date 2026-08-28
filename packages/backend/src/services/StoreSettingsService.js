import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'
import { ValidationError } from 'sequelize'

class StoreSettingsService {

    // Service Error handler instance
    #error = new ServiceErrorHandler()

    /**
     * @param {Object} model - the tenant's StoreSettings model
     * @param {Object} [dollarModel] - the tenant's Dollar model, used to validate the
     * buffer rate against the current official rate (a "colchón" that isn't above the
     * official rate isn't a buffer at all).
     */
    constructor(model, dollarModel = null) {
        this.StoreSettings = model
        this.Dollar = dollarModel
        this.#error
    }

    /**
     * Retrieves the store's settings row, creating it with defaults on first read. Also
     * reports whether the buffer rate has gone stale — the official rate caught up to or
     * passed it, so it's no longer actually a "cushion" (see DollarValueService.getEffectiveValue,
     * which already falls back to the official rate on its own when this happens) — so the
     * owner can be warned to raise it, without silently undercharging in the meantime.
     * @returns {Promise<{settings: Object, official_rate: number|null, buffer_is_stale: boolean}>}
     * @throws {ServiceError} - throws an error if the settings could not be retrieved.
     */
    getSettings() {
        return this.#error.handler(['Read Store Settings'], async () => {
            const [settings] = await this.StoreSettings.findOrCreate({
                where: { id: 1 },
                defaults: { buffer_enabled: false, buffer_rate: null }
            })

            let officialRate = null
            if (this.Dollar) {
                const officialValue = await this.Dollar.findOne({ order: [['id', 'DESC']], limit: 1 })
                officialRate = officialValue ? parseFloat(officialValue.value) : null
            }

            const bufferRate = parseFloat(settings.buffer_rate)
            const bufferIsStale = Boolean(
                settings.buffer_enabled && bufferRate && officialRate && bufferRate <= officialRate
            )

            return {
                settings,
                official_rate: officialRate,
                buffer_is_stale: bufferIsStale
            }
        })
    }

    /**
     * Updates the store's "tasa colchón" (buffer rate) settings.
     * @param {boolean} bufferEnabled - whether the buffer rate should be applied.
     * @param {number|string|null} bufferRate - the buffered Bs-per-dollar rate.
     * @returns {Promise<Object>} - the updated store settings.
     * @throws {ServiceError} - throws an error if the settings could not be updated.
     */
    updateSettings(bufferEnabled, bufferRate) {
        return this.#error.handler(['Update Store Settings'], async () => {
            const enabled = bufferEnabled === true || bufferEnabled === 'true'
            const rate = bufferRate !== null && bufferRate !== undefined && bufferRate !== ''
                ? parseFloat(bufferRate)
                : null

            if (enabled) {
                if (!rate || isNaN(rate) || rate <= 0) {
                    throw new ValidationError('La tasa colchón debe ser un número mayor a 0.')
                }

                if (this.Dollar) {
                    const officialValue = await this.Dollar.findOne({ order: [['id', 'DESC']], limit: 1 })
                    const officialRate = officialValue ? parseFloat(officialValue.value) : null
                    if (officialRate && rate <= officialRate) {
                        throw new ValidationError(`La tasa colchón (${rate}) debe ser mayor a la tasa oficial actual (${officialRate}).`)
                    }
                }
            }

            const [settings] = await this.StoreSettings.findOrCreate({
                where: { id: 1 },
                defaults: { buffer_enabled: false, buffer_rate: null }
            })

            const updatedSettings = await settings.update({
                buffer_enabled: enabled,
                buffer_rate: enabled ? rate : settings.buffer_rate,
                updated_at: new Date()
            })

            return updatedSettings
        })
    }
}

export default StoreSettingsService

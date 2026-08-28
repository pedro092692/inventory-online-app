import ControllerErrorHandler from '../errors/controllerErrorHandler.js'
import StoreSettingsService from '../services/StoreSettingsService.js'

class StoreSettingsController {
    // new instance of controller error handler
    #error = new ControllerErrorHandler()

    constructor(model, dollarModel = null) {
        this.settingsService = new StoreSettingsService(model, dollarModel)
        this.#error
    }

    /**
     * Retrieves the store's settings (currently just the "tasa colchón" buffer rate).
     * @param {Object} req - request object
     * @param {Object} res - response object to send the store settings
     * @throws {ServiceError} - throws an error if the settings could not be retrieved
     * @returns {Promise<void>} - returns the settings in the response
     */
    getSettings = this.#error.handler(async (req, res) => {
        const settings = await this.settingsService.getSettings()
        res.status(200).json({ settings })
    })

    /**
     * Updates the store's "tasa colchón" (buffer rate) settings.
     * @param {Object} req - request object containing `buffer_enabled`/`buffer_rate` in the body
     * @param {Object} res - response object to send the updated store settings
     * @throws {ServiceError} - throws an error if the settings could not be updated
     * @returns {Promise<void>} - returns the updated settings in the response
     */
    updateSettings = this.#error.handler(async (req, res) => {
        const { buffer_enabled, buffer_rate } = req.body
        const settings = await this.settingsService.updateSettings(buffer_enabled, buffer_rate)
        res.status(200).json({ settings })
    })
}

export default StoreSettingsController

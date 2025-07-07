import ControllerErrorHandler from "../errors/controllerErrorHandler.js"
import DollarValueService from "../services/DollarValueService.js"

class DollarValueController {
    // new instance of controller error handler 
    #error = new ControllerErrorHandler()

    constructor(model) {
        this.dollarService = new DollarValueService(model)
        this.#error
    }

    /**
     * Creates a new value for dollar.
     * @param {Object} req - request object containing dollar value details in the body
     * @param {Object} res - response object to send the created new dollar value
     * @throws {ServiceError} - throws an error if the dollar value could not be created
     * @returns {Promise<void>} - returns the created new dollar value in the response
     */
    createDollarValue = this.#error.handler( async(req, res) => {
        const { value } = req.body
        const newValue = await this.dollarService.createDollarValue(value)
        res.status(201).json({newValue})
    })

    /**
     * Get the latest dollar value.
     * @param {Object} req - request object
     * @param {Object} res - response object to send the latest dollar value
     * @throws {ServiceError} - throws an error if the dollar value could not be retrieved
     * @returns {Promise<void>} - returns the latest dollar value in the response
     */
    getLastValue = this.#error.handler( async(req, res) => {
        const lastValue = await this.dollarService.getLastValue()
        res.status(200).json({lastValue})
    })

    /**
     * Update the value of Dollar by its ID.
     * @param {Object} req - request object containing new dollar value and ID details in the body
     * @param {Object} res - response object to send the updated new dollar value
     * @throws {ServiceError} - throws an error if the dollar value could not be updated
     * @returns {Promise<void>} - returns the updated new dollar value in the response
     */
    updateDollarValue = this.#error.handler( async(req, res) => {
        const { value, id } = req.body
        const updateDollarValue = await this.dollarService.updateDollarValue(id, value)
        res.status(200).json({updateDollarValue})
    })

    /**
     * Deletes a dollar value by its ID.
     * @param {Object} req - request object containing the dollar value ID in the body
     * @param {Object} res - response object to send a success status
     * @throws {ServiceError} - throws an error if the dollar value could not be deleted
     * @returns {Promise<void>} - returns a success status in the response
     */
    deleteDollarValue = this.#error.handler( async(req, res) => {
        const { id } = req.body
        // delete Dollar value
        await this.dollarService.deleteDollarValue(id)
        res.status(204).json({})
    })
}

export default DollarValueController
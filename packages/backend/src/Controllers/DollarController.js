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
     * Creates a new value for dollar.
     * @param {Object} req - request object
     * @param {Object} res - response object to send the latest dollar value
     * @throws {ServiceError} - throws an error if the dollar value could not be retrieved
     * @returns {Promise<void>} - returns the latest dollar value in the response
     */
    getLastValue = this.#error.handler( async(req, res) => {
        const lastValue = await this.dollarService.getLastValue()
        res.status(200).json({lastValue})
    })
}

export default DollarValueController
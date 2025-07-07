import ControllerErrorHandler from "../errors/controllerErrorHandler"
import DollarValueService from "../services/DollarValueService"

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
}

export default DollarValueController
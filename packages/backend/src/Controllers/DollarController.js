import ControllerErrorHandler from "../errors/controllerErrorHandler"
import DollarValueService from "../services/DollarValueService"

class DollarValueController {
    // new instance of controller error handler 
    #error = new ControllerErrorHandler()

    constructor(model) {
        this.dollarService = new DollarValueService(model)
        this.#error
    }
}

export default DollarValueController
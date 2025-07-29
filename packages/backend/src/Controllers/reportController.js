import ReportService from "../services/reportService.js";
import ControllerErrorHandler from "../errors/controllerErrorHandler.js";

class ReportController {
    // new instance of controller error handler
    #error = new ControllerErrorHandler()
    
    constructor(invoiceModel) {
        this.reportService = new ReportService(invoiceModel)
        this.#error
    }
}

export default ReportController
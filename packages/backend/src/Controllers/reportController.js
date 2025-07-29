import ReportService from "../services/reportService.js";
import ControllerErrorHandler from "../errors/controllerErrorHandler.js";

class ReportController {
    // new instance of controller error handler
    #error = new ControllerErrorHandler()
    
    constructor(invoiceModel) {
        this.reportService = new ReportService(invoiceModel)
        this.#error
    }

    getTopSpendingCustomer = this.#error.handler( async(req, res) => {
        const customer = await this.reportService.getTopSpendingCustomer()
        res.status(200).json(customer)
    })
}

export default ReportController
import ReportService from "../services/reportService.js";
import ControllerErrorHandler from "../errors/controllerErrorHandler.js";

class ReportController {
    // new instance of controller error handler
    #error = new ControllerErrorHandler()
    
    constructor(invoiceModel, invoiceDetailModel=null) {
        this.reportService = new ReportService(invoiceModel, invoiceDetailModel)
        this.#error
    }

    getTopSpendingCustomer = this.#error.handler( async(req, res) => {
        const customer = await this.reportService.getTopSpendingCustomer()
        res.status(200).json(customer)
    })

    getTopRecurringCustomer = this.#error.handler( async(req, res) => {
        const customers = await this.reportService.getTopRecurringCustomer()
        res.status(200).json(customers)
    })

    getTopSellingProducts = this.#error.handler( async(req, res) => {
        const products = await this.reportService.getToSellingProduct()
        res.status(200).json(products)
    })
}

export default ReportController
import ReportService from "../services/reportService.js";
import ControllerErrorHandler from "../errors/controllerErrorHandler.js";

class ReportController {
    // new instance of controller error handler
    #error = new ControllerErrorHandler()
    
    constructor(invoiceModel, invoiceDetailModel=null, invoicePayDetailModel=null) {
        this.reportService = new ReportService(invoiceModel, invoiceDetailModel, invoicePayDetailModel)
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

    getWorstWellingProducts = this.#error.handler( async(req, res) => {
        const products = await this.reportService.getToSellingProduct('ASC')
        res.status(200).json(products)
    })

    bestSellingDay = this.#error.handler( async(req, res) => {
        const data = await this.reportService.bestSellingDay('DESC', 5)
        res.status(200).json(data)
    })

    worstSellingDay = this.#error.handler( async(req, res) => {
        const data = await this.reportService.bestSellingDay('ASC', 5)
        res.status(200).json(data)
    })

    salesPerDay = this.#error.handler( async(req, res ) => {
        const data = await this.reportService.salesPerDay()
        res.status(200).json(data)
    })

    peakSalesHour = this.#error.handler( async(req, res) => {
        const data = await this.reportService.peakSalesHour()
        res.status(200).json(data)
    })

    peakSalesDayOfWeek = this.#error.handler( async(req, res) => {
        const data = await this.reportService.peakSalesDayOfWeek()
        res.status(200).json(data)
    })

    salesDetail = this.#error.handler( async(req, res) => {
        const data = await this.reportService.dayTotalSales()
        res.status(200).json(data)
    })

    invoicePerDate = this.#error.handler( async(req, res) => {
        const data = await this.reportService.getInvoicePerDate()
        res.status(200).json(data)
    })

    cashClosing = this.#error.handler( async(req, res) => {
        const { seller_id } = req.body
        const data = await this.reportService.cashClosing(seller_id)
        res.status(200).json(data)
    })
}

export default ReportController
import ReportService from '../services/reportService.js';
import ControllerErrorHandler from '../errors/controllerErrorHandler.js';

class ReportController {
    // new instance of controller error handler
    #error = new ControllerErrorHandler()
    
    constructor(invoiceModel, invoiceDetailModel=null, invoicePayDetailModel=null) {
        this.reportService = new ReportService(invoiceModel, invoiceDetailModel, invoicePayDetailModel)
        this.#error
    }

    /**
     * Retrieves the customer who has spent the most.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with the top spending customer.
     * @throws {Error} If there is a problem retrieving the customer data.
     */
    getTopSpendingCustomer = this.#error.handler( async(req, res) => {
        const customer = await this.reportService.getTopSpendingCustomer()
        res.status(200).json(customer)
    })

    /**
     * Retrieves the most recurring customers.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with the top recurring customers.
     * @throws {Error} If there is a problem retrieving the customer data.
     */
    getTopRecurringCustomer = this.#error.handler( async(req, res) => {
        const customers = await this.reportService.getTopRecurringCustomer()
        res.status(200).json(customers)
    })

    /**
     * Retrieves the top selling products.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with the top selling products.
     * @throws {Error} If there is a problem retrieving the product data.
     */
    getTopSellingProducts = this.#error.handler( async(req, res) => {
        const products = await this.reportService.getToSellingProduct()
        res.status(200).json(products)
    })

    /**
     * Retrieves the worst selling products.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with the worst selling products.
     * @throws {Error} If there is a problem retrieving the products data.
     */
    getWorstWellingProducts = this.#error.handler( async(req, res) => {
        const products = await this.reportService.getToSellingProduct('ASC')
        res.status(200).json(products)
    })

    /**
     * Retrieves the best selling days.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with the best selling days.
     * @throws {Error} If there is a problem retrieving the days data.
     */
    bestSellingDay = this.#error.handler( async(req, res) => {
        const data = await this.reportService.bestSellingDay('DESC', 5)
        res.status(200).json(data)
    })

    /**
     * Retrieves the worst selling days.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with the worst selling days.
     * @throws {Error} If there is a problem retrieving the days data.
     */
    worstSellingDay = this.#error.handler( async(req, res) => {
        const data = await this.reportService.bestSellingDay('ASC', 5)
        res.status(200).json(data)
    })

    /**
     * Retrieves sales per day.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with sales per day.
     * @throws {Error} If there is a problem retrieving the sales data.
     */
    salesPerDay = this.#error.handler( async(req, res ) => {
        const data = await this.reportService.salesPerDay()
        res.status(200).json(data)
    })

    /**
     * Retrieves the peak sales hour.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with the peak sales hour.
     * @throws {Error} If there is a problem retrieving the sales hours data.
     */
    peakSalesHour = this.#error.handler( async(req, res) => {
        const data = await this.reportService.peakSalesHour()
        res.status(200).json(data)
    })

    /**
     * Retrieves the peak sales day of the week.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with the peak sales day of the week.
     * @throws {Error} If there is a problem retrieving the sales day of the week data.
     */
    peakSalesDayOfWeek = this.#error.handler( async(req, res) => {
        const data = await this.reportService.peakSalesDayOfWeek()
        res.status(200).json(data)
    })

    /**
     * Retrieves the sales details for the day.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with the sales details.
     * @throws {Error} If there is a problem retrieving the sales details for the day data.
     */
    salesDetail = this.#error.handler( async(req, res) => {
        const data = await this.reportService.dayTotalSales()
        res.status(200).json(data)
    })

    /**
     * Retrieves invoices per date.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with the invoices per date.
     * @throws {Error} If there is a problem retrieving the invoice data.
     */
    invoicePerDate = this.#error.handler( async(req, res) => {
        const data = await this.reportService.getInvoicePerDate()
        res.status(200).json(data)
    })

    /**
     * Performs a cash closing for a specific seller.
     * @param {Object} req - The request object.
     * @param {Object} req.body - The request body.
     * @param {number} req.body.seller_id - The ID of the seller.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with the cash closing data.
     * @throws {Error} If there is a problem retrieving closing cash data. 
     */
    cashClosing = this.#error.handler( async(req, res) => {
        const { seller_id } = req.body
        const data = await this.reportService.cashClosing(seller_id)
        res.status(200).json(data)
    })

    /**
     * Retrieves the percentage of use for each payment method.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A JSON response with the payment method percentages.
     * @throws {Error} If there is a problem retrieving the payment data.
     */
    payMethodPercent = this.#error.handler( async(req, res) => {
        const data = await this.reportService.payMethodPercent()
        res.status(200).json(data)
    })
}

export default ReportController
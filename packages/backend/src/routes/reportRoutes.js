import { Router } from 'express'
import ReportController from '../Controllers/reportController.js'
import { Invoice } from '../models/inventory_models/InvoiceModel.js'
import { InvoiceDetail } from '../models/inventory_models/InvoiceDetailModel.js'
import { PaymentDetail } from '../models/inventory_models/PaymentDetailModel.js'

class ReportRoutes {
    constructor() {
        this.router = Router()
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for the Product API.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => res.send('Report routes'))
        this.router.get('/top-spending-customers', (req, res) => new ReportController(Invoice).getTopSpendingCustomer(req, res))
        this.router.get('/top-recurring-customers', (req, res) => new ReportController(Invoice).getTopRecurringCustomer(req, res))
        this.router.get('/top-selling-products', (req, res) => new ReportController(null, InvoiceDetail ).getTopSellingProducts(req, res))
        this.router.get('/worst-selling-products', (req, res) => new ReportController(null, InvoiceDetail ).getWorstWellingProducts(req, res))
        this.router.get('/best-selling-day', (req, res) => new ReportController(Invoice).bestSellingDay(req, res))
        this.router.get('/worst-selling-day', (req, res) => new ReportController(Invoice).worstSellingDay(req, res))
        this.router.get('/sales-per-day', (req, res) => new ReportController(Invoice).salesPerDay(req, res))
        this.router.get('/peak-sales-hour', (req, res) => new ReportController(Invoice).peakSalesHour(req, res))
        this.router.get('/peak-day-week', (req, res) => new ReportController(Invoice).peakSalesDayOfWeek(req, res))
        this.router.get('/detail-sales', (req, res) => new ReportController(null, null, PaymentDetail).salesDetail(req, res))
        this.router.get('/invoices-per-day', (req, res) => new ReportController(Invoice).invoicePerDate(req, res))
        this.router.get('/cash-closing', (req, res) =>  new ReportController(null, null, PaymentDetail).cashClosing(req, res))
        this.router.get('/pay-methods', (req, res) =>  new ReportController(null, null, PaymentDetail).payMethodPercent(req, res))
    }
}

export default ReportRoutes


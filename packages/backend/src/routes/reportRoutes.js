import { Router } from 'express'
import ReportController from '../Controllers/reportController.js'
import { authenticated } from '../middlewares/authMiddleware.js'

class ReportRoutes {
    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.router.use(this.setRoutesModels.bind(this))
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for the Product API.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => res.send('Report routes'))
        this.router.get('/top-spending-customers', (req, res) => new ReportController(req.Invoice).getTopSpendingCustomer(req, res))
        this.router.get('/top-recurring-customers', (req, res) => new ReportController(req.Invoice).getTopRecurringCustomer(req, res))
        this.router.get('/top-selling-products', (req, res) => new ReportController(null, req.InvoiceDetail ).getTopSellingProducts(req, res))
        this.router.get('/worst-selling-products', (req, res) => new ReportController(null, req.InvoiceDetail ).getWorstWellingProducts(req, res))
        this.router.get('/best-selling-day', (req, res) => new ReportController(req.Invoice).bestSellingDay(req, res))
        this.router.get('/worst-selling-day', (req, res) => new ReportController(req.Invoice).worstSellingDay(req, res))
        this.router.get('/sales-per-day', (req, res) => new ReportController(req.Invoice).salesPerDay(req, res))
        this.router.get('/peak-sales-hour', (req, res) => new ReportController(req.Invoice).peakSalesHour(req, res))
        this.router.get('/peak-day-week', (req, res) => new ReportController(req.Invoice).peakSalesDayOfWeek(req, res))
        this.router.get('/detail-sales', (req, res) => new ReportController(null, null, req.PaymentDetail).salesDetail(req, res))
        this.router.get('/invoices-per-day', (req, res) => new ReportController(req.Invoice).invoicePerDate(req, res))
        this.router.get('/cash-closing', (req, res) =>  new ReportController(null, null, req.PaymentDetail).cashClosing(req, res))
        this.router.get('/pay-methods', (req, res) =>  new ReportController(null, null, req.PaymentDetail).payMethodPercent(req, res))
    }
    
    /**
     * Middleware to attach the `Invoice`, `InvoiceDetail` and `PaymentDetail` models from the tenant-specific models to the request object.
     *
     * This method extracts the `Invoice`, `InvoiceDetail` and `PaymentDetail` models from `req.tenantModels` 
     * and assigns it to `req.Invoice`, `req.InvoiceDetail` and `req.PaymentDetail`.
     * If any of the models are missing, it responds with a 400 Bad Request.
     * Otherwise, it passes control to the next middleware.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    async setRoutesModels(req, res, next) {
        const {Invoice, InvoiceDetail, PaymentDetail} = req.tenantModels
        if(!Invoice || !InvoiceDetail || !PaymentDetail) {
            return res.status(400).json({ message: 'Invoice, InvoiceDetail and PaymentDetail models are required' })
        }
        req.Invoice = Invoice
        req.InvoiceDetail = InvoiceDetail
        req.PaymentDetail = PaymentDetail
        next()
    }
}

export default ReportRoutes


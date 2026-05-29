import { Router } from 'express'
import PayInvoiceController from '../Controllers/PaymentInvoiceDetailController.js'
import { authenticated } from '../middlewares/authMiddleware.js'

class PayInvoiceRoutes {

    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.router.use(this.setRoutesModels.bind(this))
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for the Payment Detail API.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => res.send('Pay Invoice Detail Route'))
        this.router.get('/:id', (req, res) => new PayInvoiceController(req.PaymentDetail).getPaymentDetail(req, res))
        this.router.post('/', (req, res) => new PayInvoiceController
            (req.PaymentDetail, req.Dollar, req.Invoice, null, null, req.InvoiceDetail).createPaymentInvoiceDetail(req, res))
        this.router.delete('/', (req, res) => new PayInvoiceController
            (req.PaymentDetail, req.Dollar, req.Invoice, req.Seller, req.AuditLog, req.InvoiceDetail).cancelPaymentInvoiceDetail(req, res))
        this.router.patch('/:id', (req, res) => new PayInvoiceController
            (req.PaymentDetail, req.Dollar, req.Invoice).updatePaymentDetail(req, res))
        this.router.delete('/cancel', (req, res) => new PayInvoiceController
            (req.PaymentDetail, req.Dollar, req.Invoice).deletePaymentDetail(req, res))
    }

    /**
     * Middleware to attach the `Dollar`, `PaymentDetail`, `Invoice` models from the tenant-specific models to the request object.
     *
     * This method extracts the `Dollar`, `PaymentDetail`, `Invoice` models from `req.tenantModels` 
     * and assigns it to `req.Dollar`, `req.PaymentDetail`, `req.invoice`.
     * If any of the models are missing, it responds with a 400 Bad Request.
     * Otherwise, it passes control to the next middleware.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    async setRoutesModels(req, res, next) {
        const {PaymentDetail, Dollar, Invoice, Seller, InvoiceDetail, AuditLog} = req.tenantModels
        if(!Dollar || !PaymentDetail || !Invoice || !Seller || !AuditLog || !InvoiceDetail) {
            return res.status(400).json({ message: 'Dollar, Invoice, Seller, InvoiceDetail and AuditLog models are required' })
        }
        req.PaymentDetail = PaymentDetail
        req.Invoice = Invoice
        req.Dollar = Dollar,
        req.Seller = Seller,
        req.AuditLog = AuditLog,
        req.InvoiceDetail = InvoiceDetail
        next()
    }
}

export default PayInvoiceRoutes
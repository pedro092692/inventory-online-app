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
        this.router.post('/', (req, res) => new PayInvoiceController(req.PaymentDetail, req.Dollar, req.Invoice).createPaymentInvoiceDetail(req, res))
        this.router.patch('/:id', (req, res) => new PayInvoiceController(req.PaymentDetail, req.Dollar, req.Invoice).updatePaymentDetail(req, res))
        this.router.delete('/', (req, res) => new PayInvoiceController(req.PaymentDetail, req.Dollar, req.Invoice).deletePaymentDetail(req, res))
    }

    async setRoutesModels(req, res, next) {
        const {PaymentDetail, Dollar, Invoice} = req.tenantModels
        if(!Dollar || !PaymentDetail || !Invoice) {
            return res.status(400).json({ message: 'Dollar, Invoice and PaymentDetail model are required' })
        }
        req.PaymentDetail = PaymentDetail
        req.Invoice = Invoice
        req.Dollar = Dollar
        next()
    }
}

export default PayInvoiceRoutes
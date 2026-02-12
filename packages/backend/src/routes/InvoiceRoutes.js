import { Router } from 'express'
import InvoiceController from '../Controllers/InvoiceController.js'
import { authenticated } from '../middlewares/authMiddleware.js'
class InvoiceRoutes {

    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.router.use(this.setRoutesModels.bind(this))
        this.inicializateRoutes()
    }
    /**
     * Initializes the routes for the Invoice API.
     * @returns {void}
     */
    inicializateRoutes() {
        this.router.get('/', (req, res) => res.send('Invoices Routes'))
        this.router.get('/all', (req, res) => new InvoiceController(req.Invoice).allInvoices(req, res))
        this.router.get('/day', (req, res) => new InvoiceController(req.Invoice).dayInvoices(req, res))
        this.router.get('/:id', (req, res) => new InvoiceController(req.Invoice, null, null, req.Dollar).getInvoice(req, res))
        this.router.get('/search', (req, res) => new InvoiceController(req.Invoice).searchInvoicesbyId(req, res))
        this.router.get('/send-whatsapp/:id', (req, res) => new InvoiceController(req.Invoice, null, null, req.Dollar).sendWhatsappInvoice(req, res))
        this.router.post('/', (req, res) => new InvoiceController(req.Invoice, req.InvoiceDetail, req.Product, req.Dollar).createInvoice(req, res))
        this.router.patch('/:id', (req, res) => new InvoiceController(req.Invoice, req.InvoiceDetail, req.Product, req.Dollar).updateInvoice(req, res))
        this.router.delete('/', (req, res) => new InvoiceController(req.Invoice, req.InvoiceDetail, req.Product, req.Dollar).deleteInvoice(req, res))
        this.router.delete('/detail', (req, res) => new InvoiceController(req.Invoice, req.InvoiceDetail, req.Product, req.Dollar).deleteInvoiceDetail(req, res))
    }   

    /**
     * Middleware to attach the `Invoice`, `Product`, `Dollar`, `InvoiceDetail` models from the tenant-specific models to the request object.
     *
     * This method extracts the `Invoice`, `Product`, `Dollar`, `InvoiceDetail` models from `req.tenantModels` 
     * and assigns it to `req.Invoice`, `req.Product`, `req.Dollar`.
     * If any of the models are missing, it responds with a 400 Bad Request.
     * Otherwise, it passes control to the next middleware.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    async setRoutesModels(req, res, next) {
        const {Invoice, Product, Dollar, InvoiceDetail} = req.tenantModels
        if(!Dollar || !Invoice || !Product || !InvoiceDetail) {
            return res.status(400).json({ message: 'Invoice, Product, Dollar and InvoiceDetail models are required' })
        }
        req.Invoice = Invoice
        req.Product = Product
        req.InvoiceDetail = InvoiceDetail
        req.Dollar = Dollar

        next()
    }
}

export default InvoiceRoutes

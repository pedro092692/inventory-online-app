import { Router } from 'express'
import InvoiceDetailController from '../Controllers/InvoiceDetailController.js'
import { authenticated } from '../middlewares/authMiddleware.js'
import { validateFields } from '../validators/fieldValidator.js'

class InvoiceDetailRoutes {

    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.router.use(this.setRoutesModels.bind(this))
        this.inicializateRoutes()
    }
    /**
     * Initializes the routes for the InvoiceDetail API.
     * @returns {void}
     */
    inicializateRoutes() {
        this.router.get('/', (req, res) => res.send('Invoices Details Routes'))
        this.router.get('/total-pages', (req, res) => new InvoiceDetailController(req.InvoiceDetail).totalProductsPages(req, res))
        this.router.delete('/', validateFields('cancelItemDetail'), (req, res) => new InvoiceDetailController
            (req.InvoiceDetail, req.Seller).cancelInvoiceItemDetail(req, res))
    }   

    /**
     * Middleware to attach the `InvoiceDetail` model from the tenant-specific models to the request object.
     *
     * This method extracts the `InvoiceDetail` models from `req.tenantModels` 
     * and assigns it to `req.InvoiceDetail`.
     * If any of the models are missing, it responds with a 400 Bad Request.
     * Otherwise, it passes control to the next middleware.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    async setRoutesModels(req, res, next) {
        const {InvoiceDetail, Seller} = req.tenantModels
        if(!InvoiceDetail || !Seller) {
            return res.status(400).json({ message: 'InvoiceDetail and Seller models are required' })
        }

        req.InvoiceDetail = InvoiceDetail

        next()
    }
}

export default InvoiceDetailRoutes
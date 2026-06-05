import { Router } from 'express'
import InvoiceReturnController from '../Controllers/InvoiceReturnController.js'
import { authenticated } from '../middlewares/authMiddleware.js'
import { validateFields } from '../validators/fieldValidator.js'

class InvoiceReturnRoutes {

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
        this.router.get('/', (req, res) => res.send('Invoices Return Routes'))
        this.router.get('/total-pages', (req, res) => 
            new InvoiceReturnController(req.InvoiceReturn).totalReturnedProductsPages(req, res))
      
    }   

    /**
     * Middleware to attach the `InvoiceReturn` model from the tenant-specific models to the request object.
     *
     * This method extracts the `InvoiceReturn` models from `req.tenantModels` 
     * and assigns it to `req.InvoiceReturn`.
     * If any of the models are missing, it responds with a 400 Bad Request.
     * Otherwise, it passes control to the next middleware.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    async setRoutesModels(req, res, next) {
        const {InvoiceReturn} = req.tenantModels
        if(!InvoiceReturn) {
            return res.status(400).json({ message: 'InvoiceReturnModel model is required' })
        }

        req.InvoiceReturn = InvoiceReturn


        next()
    }
}

export default InvoiceReturnRoutes
import { Router } from 'express'
import CustomerController from '../Controllers/CustomerController.js'
import { authenticated } from '../middlewares/authMiddleware.js'
import { validateFields } from '../validators/fieldValidator.js'


class CustomerRoutes {
    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.router.use(this.setRoutesModels.bind(this))
        this.initializeRoutes()

    }
    /**
     * Initializes the routes for the Customer API.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => res.send('Customers Routes'))
        this.router.get('/all', (req, res) => new CustomerController(req.Customer).allCustomers(req, res))
        this.router.get('/:id', (req, res) => new CustomerController(req.Customer, req.Invoice).getCustomerById(req, res))
        this.router.post('/',  validateFields('createCustomer'), (req, res) => new CustomerController(req.Customer).createCustomer(req, res))
        this.router.patch('/:id', (req, res) => new CustomerController(req.Customer).updateCustomer(req, res))
        this.router.delete('/', (req, res) => new CustomerController(req.Customer).deleteCustomer(req, res))
    }
    
    /**
     * Middleware to attach the `Customer` model from the tenant-specific models to the request object.
     *
     * This method extracts the `Customer` model from `req.tenantModels` and assigns it to `req.Customer`.
     * If the model is missing, it responds with a 400 Bad Request.
     * Otherwise, it passes control to the next middleware.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    async setRoutesModels(req, res, next) {
        const {Customer, Invoice} = req.tenantModels
        if(!Customer || !Invoice) {
            return res.status(400).json({ message: 'Customer and Invoice models are required' })
        }
        req.Customer = Customer
        req.Invoice = Invoice
        next()
    }
}

export default CustomerRoutes

import { Router } from 'express'
import CustomerController from '../Controllers/CustomerController.js'
import { authenticated } from '../middlewares/authMiddleware.js'


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
        this.router.get('/:id', (req, res) => new CustomerController(req.Customer).getCustomerById(req, res))
        this.router.post('/', (req, res) => new CustomerController(req.Customer).createCustomer(req, res))
        this.router.patch('/:id', (req, res) => new CustomerController(req.Customer).updateCustomer(req, res))
        this.router.delete('/', (req, res) => new CustomerController(req.Customer).deleteCustomer(req, res))
    }

    async setRoutesModels(req, res, next) {
        const {Customer} = req.tenantModels
        if(!Customer) {
            return res.status(400).json({ message: 'Customer model is required' })
        }
        req.Customer = Customer
        next()
    }
}

export default CustomerRoutes

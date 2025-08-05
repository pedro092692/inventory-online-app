import { Router } from 'express'
import CustomerController from '../Controllers/CustomerController.js'
import {Customer} from '../models/inventory_models/CustomerModel.js'

class CustomerRoutes {
    constructor() {
        this.router = Router()
        this.initializeRoutes()

    }
    /**
     * Initializes the routes for the Customer API.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => res.send('Customers Routes'))
        this.router.get('/all', (req, res) => new CustomerController(Customer).allCustomers(req, res))
        this.router.get('/:id', (req, res) => new CustomerController(Customer).getCustomerById(req, res))
        this.router.post('/', (req, res) => new CustomerController(Customer).createCustomer(req, res))
        this.router.patch('/:id', (req, res) => new CustomerController(Customer).updateCustomer(req, res))
        this.router.delete('/', (req, res) => new CustomerController(Customer).deleteCustomer(req, res))
    }
}

export default CustomerRoutes

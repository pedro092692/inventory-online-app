import CustomerService from "../services/CustomerService.js"
import controllerErrorHandler from "../errors/controllerErrorHandler.js"

class CustomerController {
    #error = new controllerErrorHandler()
    constructor(model) {
        this.customerService = new CustomerService(model)
        this.#error
    }

    createCustomer = this.#error.handler( async(req, res) => {
        const { id_number, name, phone } = req.body
        const newCustomer = await this.customerService.createCustomer(id_number, name, phone)
        res.status(200).json({newCustomer})
    })

  
    allCustomers = this.#error.handler( async(req, res) => {
        const customers = await this.customerService.getAllCustomers()
        res.status(200).json(customers)
    })

    getCustomerById = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const customer = await this.customerService.getCustomerById(id)
        res.status(200).json(customer)
    })

    updateCustomer = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const updates = req.body
        const updatedCustomer = await this.customerService.updateCustomer(id, updates)
        res.status(200).json(updatedCustomer)
    })

    deleteCustomer = this.#error.handler( async(req, res) => {
        const customerId = req.body.customerId
        // delete customers 
        await this.customerService.deleteCustomer(customerId)
        res.status(204).json({})
    })
}

export default CustomerController
import CustomerService from "../services/CustomerService.js"
import controllerErrorHandler from "../errors/controllerErrorHandler.js"

class CustomerController {
    #error = new controllerErrorHandler()
    constructor(model) {
        this.customerService = new CustomerService(model)
        this.#error
    }

  
    allCustomers = this.#error.handler( async(req, res) => {
        const customers = await this.customerService.getAllCustomers()
        res.status(200).json(customers)
    })

    getCustomerById = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const customer = await this.customerService.getCustomerById(id)
        res.status(200).json(customer)
    })
}

export default CustomerController
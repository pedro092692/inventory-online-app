import CustomerService from "../services/CustomerService.js"
class CustomerController {
    constructor(model) {
        this.customerService = new CustomerService(model)
    }

    async allCustomers(req, res) {
        try {
            const customers = await this.customerService.getAllCustomers()
            
            res.status(200).json(customers)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async getCustomerById(req, res) {
        const { id } = req.params
        try {
            const customer = await this.customerService.getCustomerById(id)
            res.status(200).json(customer)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }
}

export default CustomerController
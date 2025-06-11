import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import { NotFoundError } from "../errors/NofoundError.js"

class CustomerService {

    // instance of error handler 
    #error = new ServiceErrorHandler()
    
    constructor(model) {
        this.Customer = model
        this.#error
    }

    /**
     * Creates a new customer with the given id_number, name, and phone.
     * @param {number} id_number - The ID number of the customer.
     * @param {string} name - The name of the customer.
     * @param {string} phone - The phone number of the customer.
     * @return {Promise<Object>} - A promise that resolves to the created customer object.
     * @throws {ServiceError} - If an error occurs during customer creation.
     */ 
    createCustomer(id_number, name, phone) {
        return this.#error.handler(["Cretae Customer"], async() => {
            const newCustomer = await this.Customer.create({
                id_number: id_number,
                name: name, 
                phoen: phone
            })
            return newCustomer
        })
    }

    getAllCustomers(limit=10, offset=0) {
        return this.#error.handler(["Read All Customers"], async () => {
            const customers = await this.Customer.findAll({
                include: {
                    association: "invoices",
                    attributes: ["id", "date", "total"],
                },
                order: [["id", "DESC"], ["invoices", "id", "DESC"]],

                limit: limit,
                offset: offset
            })
            return customers
        })
    }

    getCustomerById(id) {
        return this.#error.handler(["Read Customer", id, "User"], async () => {
            const customer = await this.Customer.findByPk(id)
            if(!customer) {
                throw new NotFoundError()
            }
            return customer
        })
    }

    updateCustomer(customerId, updates) {
        return this.#error.handler(["Update Customer", customerId, "Customer"], async() => {
            const customer = await this.getCustomerById(customerId)
            const updatedCustomer = await customer.update(updates)
            return updatedCustomer
        })
    }

    deleteCustomer(customerId) {
        return this.#error.handler(["Delete Customer", customerId, "Customer"], async() => {
            const customer = await this.getCustomerById(customerId)
            // delete customer
            await customer.destroy()
            return 1
        })
    }
}
    
export default CustomerService
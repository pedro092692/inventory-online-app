import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'
import { NotFoundError } from '../errors/NofoundError.js'

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
        return this.#error.handler(['Cretae Customer'], async() => {
            const newCustomer = await this.Customer.create({
                id_number: id_number,
                name: name, 
                phone: phone
            })
            return newCustomer
        })
    }

    /**
     * Retrieves all customers with their associated invoices.
     * @param {number} limit - The maximum number of customers to retrieve.
     * @param {number} offset - The number of customers to skip before starting to retrieve.
     * @return {Promise<Array>} - A promise that resolves to an array of customer objects with their invoices.
     * @throws {ServiceError} - If an error occurs during customer retrieval.
     */
    getAllCustomers(limit=10, offset=0) {
        return this.#error.handler(['Read All Customers'], async () => {
            const customers = await this.Customer.findAll({
                include: {
                    association: 'invoices',
                    attributes: ['id', 'date', 'total'],
                },
                order: [['id', 'DESC'], ['invoices', 'id', 'DESC']],

                limit: limit,
                offset: offset
            })
            return customers
        })
    }

    /**
     * Retrieves a customer by their ID.
     * @param {number} id - The ID of the customer to retrieve.
     * @return {Promise<Object>} - A promise that resolves to the customer object.
     * @throws {NotFoundError} - If the customer is not found.
     * @throws {ServiceError} - If an error occurs during customer retrieval.
     */
    getCustomerById(id) {
        return this.#error.handler(['Read Customer', id, 'User'], async () => {
            const customer = await this.Customer.findByPk(id, {
                include: [
                    {
                        association: 'invoices',
                        attributes: ['id', 'total', 'status', 'date']
                    }
                ],
                order: [['invoices', 'id', 'DESC']]
            })
            if(!customer) {
                throw new NotFoundError()
            }
            return customer
        })
    }

    /**
     * Updates a customer by their ID with the provided updates.
     * @param {number} customerId - The ID of the customer to update.
     * @param {Object} updates - The updates to apply to the customer.
     * @return {Promise<Object>} - A promise that resolves to the updated customer object.
     * @throws {NotFoundError} - If the customer is not found.
     * @throws {ServiceError} - If an error occurs during customer update.
     */
    updateCustomer(customerId, updates) {
        return this.#error.handler(['Update Customer', customerId, 'Customer'], async() => {
            const customer = await this.getCustomerById(customerId)
            const updatedCustomer = await customer.update(updates)
            return updatedCustomer
        })
    }

    /**
     * Deletes a customer by their ID.
     * @param {number} customerId - The ID of the customer to delete.
     * @return {Promise<number>} - A promise that resolves to the number of deleted customers (1 if successful).
     * @throws {NotFoundError} - If the customer is not found.
     * @throws {ServiceError} - If an error occurs during customer deletion.
     */
    deleteCustomer(customerId) {
        return this.#error.handler(['Delete Customer', customerId, 'Customer'], async() => {
            const customer = await this.getCustomerById(customerId)
            // delete customer
            await customer.destroy()
            return 1
        })
    }
}
    
export default CustomerService
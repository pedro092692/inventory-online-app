import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'

class CustomerCreditService {
    #error = new ServiceErrorHandler()
    constructor(model) {
        this.CustomerCredit = model
        this.#error
    }

    /**
     * Creates a new customer credit entry.
     *
     * @param {Object} data - The data required to create the customer credit.
     * @param {number} data.customer_id - The ID of the customer receiving the credit.
     * @param {number} data.payment_method_id - The ID of the payment method used for the credit.
     * @param {number} data.amount - The amount of credit assigned to the customer.
     * @param {string} data.status - The status of the credit (e.g., 'active', 'void').
     * @param {number|null} data.origin_invoice_id - The ID of the invoice from which the credit originates, if applicable.
     *
     * @param {Object} [options={}] - Additional options for the database operation.
     * @param {import('sequelize').Transaction} [options.transaction] - Optional Sequelize transaction.
     *
     * @returns {Promise<Object>} A promise that resolves to an object containing the created customer credit.
     *
     * @throws {ServiceError} If an error occurs during the creation process.
     */
    createCustomerCredit({customer_id, payment_method_id, amount, status, origin_invoice_id}, options = {}) {
        return this.#error.handler(['Create Customer Credit'], async() => {
            const newCredit = await this.CustomerCredit.create({
                customer_id,
                payment_method_id,
                amount,
                status,
                origin_invoice_id
            },
            {
                transaction: options.transaction || null
            })

            return {
                customerCredit: newCredit
            }
        })
    }
}

export default CustomerCreditService
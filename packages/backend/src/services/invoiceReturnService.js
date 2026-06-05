import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'

class InvoiceReturnService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.InvoiceReturn = model
        this.#error 
    }


    processPartialReturn(invoice_id, invoice_detail_id, customer_credit_id, quantity, user_id, supervisor_seller_id=null) {
        return this.#error.handler(['Process Partial Return'], async() => {
            newPartialReturn = await this.InvoiceReturn.create({
                invoice_id,
                invoice_detail_id,
                customer_credit_id,
                quantity,
                user_id,
                supervisor_seller_id
            })

            return {
                newPartialReturn: newPartialReturn
            }
        })
    }
    
    /**
     * Retrieves the total count of returned products associated with a specific invoice.
     * @param {string|number} invoiceId - The unique identifier of the invoice.
     * @returns {Promise<number>} A promise that resolves to the total number of products.
     * @throws {Error} If the database query fails, handled by the internal error handler.
     */
    invoiceReturnTotalPages(invoiceId, limit = 8) {
        return this.#error.handler(['Invoice Return Total Pages'], async() => {
            const totalPages = await this.InvoiceReturn.count(
                {
                    where: {
                        invoice_id: invoiceId
                    }
                }
            )

            return Math.ceil(totalPages / limit)
        })
    }
}

export default InvoiceReturnService
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
    * Retrieves a paginated list of returned products for a specific invoice.
    *
    * @param {number|string} invoiceId - The ID of the invoice whose returned products should be fetched.
    * @param {number} [page=1] - The current page number for pagination.
    * @param {number} [limit=8] - The maximum number of returned products to retrieve per page.
    * @returns {Promise<Object>} An object containing the list of returned products.
    *
    * @description
    * This method queries the `InvoiceReturn` table to obtain all returned products
    * associated with a given invoice. It includes related invoice and product data,
    * applies pagination (limit and offset), and sorts results by creation date
    * in descending order.
    */
    invoiceReturnedProducts(invoiceId, page=1, limit=8) {
        return this.#error.handler(['Invoice Returned Products'], async() => {
            const offset = (page - 1) * limit
            const returnedProducts = await this.InvoiceReturn.findAll({
                where: {
                    invoice_id: invoiceId
                },
                include: [
                    {
                        association: 'invoice',
                        include: [
                            {
                                association: 'products',
                                attributes: ['name']
                            }
                        ]

                    }
                ],
                attributes: ['invoice_id', 'quantity', 'amount_returned', 'created_at'],
                order: [['created_at', 'DESC']],
                limit: limit,
                offset: offset
            })
            
            return {
                returnedProducts: returnedProducts
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
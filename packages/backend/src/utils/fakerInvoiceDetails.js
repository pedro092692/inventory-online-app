import { invoices } from './fakerInvoice.js'

/**
 * Class representing a utility to generate fake invoice details.
 */

class FakerInvoiceDetails {
    /**
     * Initializes the FakerInvoiceDetails instance with product data.
     * Assumes `invoices` is a predefined global or imported variable containing product details.
     */
    constructor() {
        /**
         * The product details used to generate invoice data.
         * @type {Array<object>}
         */

        this.productsDetails = invoices
    }
    
    /**
     * Creates an array of invoice detail objects from the provided invoice data.
     *
     * @param {Array<object>} details - An array of invoice objects, each containing an `invoice_id` and a list of `products`.
     * @param {string|number} details[].invoice_id - The unique identifier for the invoice.
     * @param {Array<object>} details[].products - The list of products associated with the invoice.
     * @param {string|number} details[].products[].product_id - The unique identifier for the product.
     * @param {number} details[].products[].quantity - The quantity of the product.
     * @param {number} details[].products[].price - The unit price of the product.
     *
     * @returns {Array<object>} An array of invoice detail objects, each containing `invoice_id`, `product_id`, `quantity`, and `unit_price`.
     */

    createInvoiceDetails(details) {
        const invoiceDetails = []
        details.map((detail) => {
            
            for(let product of detail.products) {
                invoiceDetails.push({
                    invoice_id: detail.invoice_id,
                    product_id: product.product_id,
                    quantity: product.quantity,
                    unit_price: product.price
                })
            }
        })

        return invoiceDetails
    }

}

const faker = new FakerInvoiceDetails()
const invoiceDetails = faker.createInvoiceDetails(faker.productsDetails)
export { invoiceDetails }
import { invoices } from "./fakerInvoice.js"

class FakerInvoiceDetails {
    constructor() {
        this.productsDetails = invoices
    }

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
console.log(invoiceDetails)
export { invoiceDetails }
import { products } from './fakerProducts.js'
import { dollarValues } from './fakerDollar.js';

/**
 * @classdesc A class to generate fake invoice data.
 */
class FakerInvoice {
    constructor() {
        this.productRange = Math.floor(Math.random() * 7 ) + 1
        this.sellerId = Math.floor(Math.random() * 4) + 1;
        this.products = products
        this.productsForInvoice = []
        this.dollarValues = dollarValues
    }

    /**
     * Populates the `productsForInvoice` array with a random number of products.
     * The number of products is determined by `this.productRange`.
     * @returns {void}
     */
    getProducts() {
        const range = this.productRange
        for(let i=0; i<range; i++) {
            const randomProduct = Math.floor(Math.random() * this.products.length) + 1
            const product = this.products[randomProduct]
            const randomQuantity = Math.floor(Math.random() * 3) + 1
            this.productsForInvoice.push(
                {
                    product_id: randomProduct,
                    quantity: randomQuantity,
                    price: product.selling_price,
                    total: product.selling_price * randomQuantity
                }
            )
        }
    }

    /**
     * Generates an array of dates from a specified number of months ago until today.
     * @param {number} [count=6] - The number of past months to generate dates for.
     * @returns {Array<Date>} An array of Date objects.
     */
    generateDates(count = 6) {
        const today = new Date()
        const startDate = new Date(today)
        const dates = []
        // set date to six months ago 
        startDate.setMonth(today.getMonth() - count)
        // set to first day of the month
        startDate.setDate(1)

        // iterate over dates
        for(let currentDate = new Date(startDate); currentDate<= today; currentDate.setDate(currentDate.getDate() + 1)) {
           const dateToAdd = new Date(currentDate)
           dates.push(dateToAdd)
        }

        return dates
    }

    /**
     * Generates a list of fake invoices for a given array of dates.
     * @param {Array<Date>} dates - An array of dates to generate invoices for.
     * @returns {Array<Object>} An array of fake invoice objects.
     */
    generateInvoices(dates) {
        const invoices = []
        let i = 0
        let j = 1
        // iterate over dates
        for(let date of dates) {
            for(let k =0; k<Math.floor(Math.random() * (122 - 10)) + 10; k++){
                const randomUser = this._randomId(150)
                const randomSeller = this._randomId(3)
                const numberOfProduct = this._randomNumberProducts()
                const products = this._getRandomProducts(numberOfProduct, 499)
                const total = this._getInvoiceTotal(products)
                let dollarValue = 0
                try{
                    dollarValue = this.dollarValues[i].value
                }catch{
                    dollarValue = 1
                }
                const newDate = new Date(date)
                newDate.setHours(Math.floor(Math.random() * (20 - 8)) + 8 )
                newDate.setMinutes(Math.floor(Math.random() * 60) )
                newDate.setSeconds (Math.floor(Math.random() * 60) )
                invoices.push(
                    {   
                        invoice_id: j,
                        date: newDate,
                        customer_id: randomUser,
                        seller_id: randomSeller,
                        // numberOfProduct: numberOfProduct,
                        products: products,
                        total: total,
                        total_reference: total * dollarValue,
                        total_paid: total,
                        status: 'paid'
                    }
                )
                j++
            }
            
            i++
            if([5,6].includes(date.getDay()) ){
               i--
            }
            
            
        }
        return invoices
    }

    /**
     * Formats a list of invoices to be inserted into the database.
     * It removes the 'products' and 'invoice_id' properties.
     * @param {Array<Object>} invoices - The array of invoice objects to format.
     * @returns {Array<Object>} An array of formatted invoice objects ready for the database.
     */
    invoiceForDb(invoices) {
        return invoices.map((invoice) => {
            return {
                date: invoice.date,
                customer_id: invoice.customer_id,
                seller_id: invoice.seller_id,
                total: invoice.total,
                total_reference: invoice.total_reference,
                total_paid: invoice.total_paid,
                status: invoice.status
            }
        })
    }

    /**
     * Generates a random ID within a given maximum value.
     * @private
     * @param {number} [max=150] - The maximum value for the random ID.
     * @returns {number} A random integer between 1 and `max`.
     */
    _randomId(max = 150) {
        return Math.floor(Math.random() * max) + 1
    }

    /**
     * Gets a random list of products for an invoice.
     * @private
     * @param {number} numberOfProducts - The number of products to get.
     * @param {number} [productCount=499] - The total number of available products.
     * @returns {Array<Object>} An array of product objects for the invoice.
     */
    _getRandomProducts(numberOfProducts, productCount = 499) {
        const products = {}
        const invoiceProducts = []
        
        //get random products from products array 
        for(let item = 0; item<numberOfProducts; item++) {
            //get random product id 
            const randomProductId = this._randomId(productCount)
            if(!(randomProductId in products)){
                const quantity = this._randomId(3)
                products[randomProductId] = {
                    id: randomProductId,
                    name: this.products[randomProductId].name,
                    price: this.products[randomProductId].selling_price,
                    quantity: quantity,
                    total: this.products[randomProductId].selling_price * quantity
                }
            }         
        }

        for(let product in products) {
            invoiceProducts.push(
                {
                    product_id: products[product].id,
                    name: products[product].name,
                    price: products[product].price,
                    quantity: products[product].quantity,
                    total: products[product].total
                }
            )
        }
        
        return invoiceProducts
    }

    /**
     * Generates a random number of products for an invoice, typically between 1 and 7.
     * It has a specific logic to favor 1 product.
     * @private
     * @returns {number} The number of products.
     */
    _randomNumberProducts() {
        // generate random number of products, with range between 1 and 7 products
        let numberProducts = Math.floor(Math.random() * 7) + 1
        
        if(numberProducts == 5 && Math.floor(Math.random() * 9) < 7){
            numberProducts = 1
        }

        return numberProducts

    }

    /**
     * Calculates the total amount for a list of products in an invoice.
     * @private
     * @param {Array<{total: number}>} products - An array of product objects, each with a 'total' property.
     * @returns {number} The sum of all product totals.
     */
    _getInvoiceTotal(products) {
        return products.reduce((sum, currentProduct) => {
            return sum + currentProduct.total
        }, 0) 
    }


}

const faker = new FakerInvoice()
const dates = faker.generateDates()
const invoices = faker.generateInvoices(dates)
const invoicesForDb = faker.invoiceForDb(invoices)

export {invoices, invoicesForDb}

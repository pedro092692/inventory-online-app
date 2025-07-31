import { products } from "./fakerProducts.js"
import { dollarValues } from "./fakerDollar.js";

class FakerInvoice {
    constructor() {
        this.productRange = Math.floor(Math.random() * 7 ) + 1
        this.sellerId = Math.floor(Math.random() * 4) + 1;
        this.products = products
        this.productsForInvoice = []
        this.dollarValues = dollarValues
    }

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

    generateInvoices(dates) {
        const invoices = []
        let i = 0
        let j = 1
        // iterate over dates
        for(let date of dates) {
            
            const randomUser = this._randomId(150)
            const randomSeller = this._randomId(3)
            const numberOfProduct = this._randomNumberProducts()
            const products = this._getRandomProducts(numberOfProduct, 499)
            const total = this._getInvoiceTotal(products)
            const dollarValue = this.dollarValues[i].value
            invoices.push(
                {   
                    invoice_id: j,
                    date: date,
                    customer_id: randomUser,
                    seller_id: randomSeller,
                    // numberOfProduct: numberOfProduct,
                    products: products,
                    total: total,
                    total_reference: total * dollarValue,
                    total_paid: total,
                    status: "paid"
                }
            )
            
            i++
            j++
            if([5,6].includes(date.getDay()) ){
               i--
            }
            
            
        }
        return invoices
    }

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

    _randomId(max = 150) {
        return Math.floor(Math.random() * max) + 1
    }

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

    _randomNumberProducts() {
        // generate random number of products, with range between 1 and 7 products
        let numberProducts = Math.floor(Math.random() * 7) + 1
        
        if(numberProducts == 5 && Math.floor(Math.random() * 9) < 7){
            numberProducts = 1
        }

        return numberProducts

    }

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

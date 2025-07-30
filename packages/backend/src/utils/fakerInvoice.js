import { products } from "./fakerProducts.js"

class FakerInvoice {
    constructor() {
        this.productRange = Math.floor(Math.random() * 7 ) + 1
        this.sellerId = Math.floor(Math.random() * 4) + 1;
        this.products = products
        this.productsForInvoice = []
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
        console.log(this.productsForInvoice)
    }

}

const faker = new FakerInvoice()
console.log(faker.getProducts())
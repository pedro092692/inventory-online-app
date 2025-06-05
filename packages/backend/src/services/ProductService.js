import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import { NotFoundError } from "../errors/NofoundError.js"

class ProductService{
    // instance of error handler
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.Product = model
        this.#error
    }

    createProduct(barcode, name, purchase_price, selling_price, stock) {
        return this.#error.handler(["Create Product"], async() => {
            const newProduct = await this.Product.create({
                barcode: barcode,
                name: name, 
                purchase_price: purchase_price, 
                selling_price: selling_price,
                stock
            })
            return newProduct
        })
    }

    getAllProducts(limit=10, offset=0) {
        return this.#error.handler(["Read All Products"], async () => {
            const products = await this.Product.findAll({
                limit: limit,
                offset: offset
            })
            return products
        })    
    }

    getProduct(id) {
        return this.#error.handler(["Read Product", id, "Product"], async () => {
            const product = await this.Product.findByPk(id)

            if(!product) {
                throw new NotFoundError()
            }

            return product
        })
    }

    updateProduct(productId, updates) {
        return this.#error.handler(["Update Product", productId, "Product"], async() => {
            const product = await this.getProduct(productId)
            const updatedProduct = await product.update(updates)
            return updatedProduct
        })
    }


}

export default ProductService
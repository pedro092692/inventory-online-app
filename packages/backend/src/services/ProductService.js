import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import { NotFoundError } from "../errors/NofoundError.js"

class ProductService{
    // instance of error handler
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.Product = model
        this.#error
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
}

export default ProductService
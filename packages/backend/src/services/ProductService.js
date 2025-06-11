import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import { NotFoundError } from "../errors/NofoundError.js"

class ProductService{
    // instance of error handler
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.Product = model
        this.#error
    }

    /**
     * @param {Srting} barcode - barcode of the product
     * @param {String} name - name of the product
     * @param {Number} purchase_price - purchase price of the product
     * @param {Number} selling_price - selling price of the product
     * @param {Number} stock - stock of the product 
     * @returns {Promise<Object>} - returns the created product
     * @throws {ServiceError} - throws an error if the product could not be created
     */
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

    deleteProduct(productId) {
        return this.#error.handler(["Delete Product", productId, "Product"], async() => {
            const product = await this.getProduct(productId)
            // delete product
            await product.destroy()
            return 1
        })
    }

    getProductStock(details) {
        return this.#error.handler(["Read Stock Product"], async() => {
            const products = await this.Product.findAll({
                where: { id: details.map(detail => detail.product_id) },
                attributes: ["id", "stock"]
            })
            return products
        })
    }

    updateStock(details) {
        return this.#error.handler(["Update Stock"], async() => {
            await Promise.all(
                details.map(detail => this.Product.increment(
                    {
                      stock: - detail.quantity
                    },
                    {
                        where: {
                            id: detail.product_id
                        }
                    }
                ))
            )
        })
    }

    restoreStock(product_id, quantity) {
         return this.#error.handler(["Update Stock"], async() => {
            await this.Product.increment(
                {
                    stock: + quantity
                },
                {
                    where: { id: product_id }
                }
            )
            
        })
    }


}

export default ProductService
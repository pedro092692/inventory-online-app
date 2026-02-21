import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'
import { NotFoundError } from '../errors/NofoundError.js'
import DollarValueService from './DollarValueService.js'
import { Op } from 'sequelize'

class ProductService{
    // instance of error handler
    #error = new ServiceErrorHandler()

    constructor(model, dollarValueModel=null) {
        this.Product = model
        this.dollarValue = new DollarValueService(dollarValueModel)
        this.#error
    }

    /**
     * Creates a new product.
     * @param {Srting} barcode - barcode of the product
     * @param {String} name - name of the product
     * @param {Number} purchase_price - purchase price of the product
     * @param {Number} selling_price - selling price of the product
     * @param {Number} stock - stock of the product 
     * @returns {Promise<Object>} - returns the created product
     * @throws {ServiceError} - throws an error if the product could not be created
     */
    createProduct(barcode, name, purchase_price, selling_price, stock) {
        return this.#error.handler(['Create Product'], async() => {
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

    /**
     * Retrieves all products with pagination.
     * @param {Number} limit - limit of products to return
     * @param {Number} offset - offset of products to return
     * @returns {Promise<Array>} - returns an array of products
     * @throws {ServiceError} - throws an error if the products could not be retrieved
     */
    getAllProducts(limit = 10, offset = 0, includePurchasePrice = false) {
        let attributes  = ['id', 'barcode', 'name', 'selling_price','stock']
        if (includePurchasePrice) {
            attributes.push('purchase_price')
        }

        return this.#error.handler(['Read All Products'], async () => {
            const count = await this.Product.count()
            const products = await this.Product.findAll({
                attributes: attributes,
                limit: limit,
                offset: offset
            })
            return {
                products: products,
                total: count,
                page: Math.floor(offset / limit ) + 1,
                pageSize: limit
            }
        })    
    }
    
    /**
     * Retrieves a product by its ID.
     * @param {Number} id - id of the product to retrieve
     * @returns {Promise<Object>} - returns the product with the given id
     * @throws {ServiceError} - throws an error if the product could not be retrieved
     */
    getProduct(id, priceReference=true) {
        return this.#error.handler(['Read Product', id, 'Product'], async () => {
            const product = await this.Product.findByPk(id)

            if(!product) {
                throw new NotFoundError()
            }
            
            // add reference selling price to product 
            if(priceReference){
                
                // get the last dollar value
                const dollarValue = await this.dollarValue.getLastValue()

                // set reference selling price to the product
                product.dataValues.reference_selling_price = (parseFloat(product.selling_price) * parseFloat(dollarValue.value)).toFixed(2)
                
                // if dollar value is not found, set reference selling price to message 
                if(!dollarValue) {
                    product.dataValues.reference_selling_price = 'No dollar value found'
                }
            }
            
            return product
        })
    }

    /**
     * Searches for product by name and barcode.
     * @param {string} query - The name or barcode to search for.
     * @param {number} [limit=10] - The maximum number of results to return.
     * @param {number} [offset=0] - The number of results to skip.
     * @return {Promise<Object>} - A promise that resolves to an object containing search results and pagination info.
     * @throws {ServiceError} - If an error occurs during the search.
     */
    searchProducts(query, limit = 10, offset = 0, includePurchasePrice = true) {
        let attributes  = ['id', 'barcode', 'name', 'selling_price','stock']
        if (includePurchasePrice) {
            attributes.push('purchase_price')
        }
        return this.#error.handler(['Search Products', query, 'Product'], async () => {
            const results = await this.Product.findAndCountAll({
                where: {
                    [Op.or]: [
                        { name: {[Op.substring]: query.toLowerCase()} },
                        { barcode: {[Op.substring]: query.toLowerCase()} }
                    ]
                },
                attributes: attributes,
                order: [['id', 'DESC']],
                limit: limit,
                offset: offset
            })
            return {
                products: results.rows,
                total: results.count,
                page: Math.floor(offset / limit ) + 1,
                pageSize: limit
            }
        })
    }

    /**
     * Updates a product by its ID.
     * @param {Number} productId - id of the product to update
     * @param {Object} updates - object containing the updates to be made
     * @param {String} updates.barcode - barcode of the product
     * @param {String} updates.name - name of the product
     * @param {Number} updates.purchase_price - purchase price of the product
     * @param {Number} updates.selling_price - selling price of the product
     * @param {Number} updates.stock - stock of the product
     * @returns {Promise<Object>} - returns the updated product
     */
    updateProduct(productId, updates) {
        return this.#error.handler(['Update Product', productId, 'Product'], async() => {
            const product = await this.getProduct(productId, false)
            const updatedProduct = await product.update(updates)
            return updatedProduct
        })
    }

    /**
     * Deletes a product by its ID.
     * @param {Number} productId - id of the product to delete
     * @returns {Promise<Number>} - returns 1 if the product was deleted successfully
     * @throws {ServiceError} - throws an error if the product could not be deleted
     */
    deleteProduct(productId) {
        return this.#error.handler(['Delete Product', productId, 'Product'], async() => {
            const product = await this.getProduct(productId, false)
            // delete product
            await product.destroy()
            return 1
        })
    }

    /**
     * Retrieves stock for multiple products based on their IDs.
     * @param {Array} details - array of objects containing product_id and quantity
     * @param {Number} details.product_id - id of the product
     * @returns {Promise<Array>} - returns an array of products with their stock
     * @throws {ServiceError} - throws an error if the stock could not be retrieved
     */
    getProductStock(details) {
        return this.#error.handler(['Read Stock Product'], async() => {
            const products = await this.Product.findAll({
                where: { id: details.map(detail => detail.product_id) },
                attributes: ['id', 'stock']
            })
            return products
        })
    }

    /**
     * Retrieves the unit price for multiple products based on their IDs.   
     * @param {Array} details - array of objects containing product_id and quantity
     * @param {Number} details.product_id - id of the product
     * @returns {Promise<Array>} - returns an array of products with their unit price
     * @throws {ServiceError} - throws an error if the unit price could not be retrieved
     */
    getProductUnitPrice(details) {
        return this.#error.handler(['Read Unit Price Product'], async() => {
            const products = await this.Product.findAll({
                where: { id: details.map(detail => detail.product_id)},
                attributes: ['id', 'selling_price']
            })
            return products
        })
    }

    /**
     * Updates stock for multiple products by decrementing their stock quantity.
     * @param {Array} details - array of objects containing product_id and quantity
     * @param {Number} details.product_id - id of the product
     * @param {Number} details.quantity - quantity of the product to be updated
     * @returns {Promise<void>} - returns nothing
     * @throws {ServiceError} - throws an error if the stock could not be updated
     */
    updateStock(details) {
        return this.#error.handler(['Update Stock'], async() => {
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

    /**
     * Restores stock for a product by incrementing its stock quantity.
     * @param {Number} product_id - id of the product to restore stock
     * @param {Number} quantity - quantity of the product to be restored
     * @returns {Promise<void>} - returns nothing
     * @throws {ServiceError} - throws an error if the stock could not be restored
     */
    restoreStock(product_id, quantity) {
         return this.#error.handler(['Update Stock'], async() => {
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
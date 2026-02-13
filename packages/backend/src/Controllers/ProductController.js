import ProductService from '../services/ProductService.js';
import ControllerErrorHandler from '../errors/controllerErrorHandler.js';

class ProductController{
    // error controller new instace 
    #error = new ControllerErrorHandler()
    
    constructor(model, dollarValueModel=null) {
        this.ProductService = new ProductService(model, dollarValueModel)
        this.#error
    }

    /**
     * Creates a new product.
     * @param {Object} req - request object containing product details in the body
     * @param {Object} res - response object to send the created product
     * @throws {ServiceError} - throws an error if the product could not be created
     * @returns {Promise<void>} - returns the created product in the response
     */
    createProduct = this.#error.handler( async(req, res) => {
        const { barcode, name, purchase_price, selling_price, stock } = req.body
        const product = await this.ProductService.createProduct(barcode, name, purchase_price, selling_price, stock)
        res.status(201).json(product)
    })

    /**
     * Retrieves all products.
     * @param {Object} req - request object
     * @param {Object} res - response object to send the list of products
     * @throws {ServiceError} - throws an error if the products could not be retrieved
     * @returns {Promise<void>} - returns the list of products in the response
     */
    allProducts = this.#error.handler( async(req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const offset = req.query.offset ? parseInt(req.query.offset) : 0
        const role = []
        const {products, total, page, pageSize} = await this.ProductService.getAllProducts(limit, offset)
        res.status(200).json({products, total, page, pageSize, role})
    })

    /**
     * Retrieves a product by its ID.
     * @param {Object} req - request object containing the product ID in the params
     * @param {Object} res - response object to send the product details
     * @throws {ServiceError} - throws an error if the product could not be found
     * @returns {Promise<void>} - returns the product details in the response
     */
    getProduct = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const product = await this.ProductService.getProduct(id)
        res.status(200).json(product)
    })

    /**
     * Updates a product by its ID.
     * @param {Object} req - request object containing the product ID in the params ID and updates in the body
     * @param {Object} res - response object to send the updated product
     * @throws {ServiceError} - throws an error if the product could not be updated
     * @returns {Promise<void>} - returns the updated product in the response
     */
    updateProduct = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const updates = req.body
        const updatedProduct = await this.ProductService.updateProduct(id, updates)
        res.status(200).json(updatedProduct)
    })

    /**
     * Deletes a product by its ID.
     * @param {Object} req - request object containing the product ID in the body
     * @param {Object} res - response object to send a success status
     * @throws {ServiceError} - throws an error if the product could not be deleted
     * @returns {Promise<void>} - returns a success status in the response
     */
    deleteProduct = this.#error.handler( async(req, res) => {
        const productId = req.body.productId 
        // delete product
        await this.ProductService.deleteProduct(productId)
        res.status(204).json({})
    })

    
}

export default ProductController
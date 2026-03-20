import ProductService from '../services/ProductService.js'
import ControllerErrorHandler from '../errors/controllerErrorHandler.js'
import { getUserRole } from '../middlewares/authorization.js'
import { userPermissions } from './CustomerController.js'

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
        let includePurchasePrice = this.includePurchasePrice(req)
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const permissions = userPermissions(req)
        const {products} = await this.ProductService.getAllProducts(limit, page, includePurchasePrice)
        res.status(200).json({products, permissions: permissions})
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
     * Searches for product based on a query string.
     * @param {Object} req - request object containing the search query and pagination parameters
     * @param {Object} res - response object to send the search results
     * @throws {ServiceError} - throws an error if the search operation fails
     * @returns {Promise<void>} - returns the search results in the response
     */
    searchProducts = this.#error.handler( async(req, res) => {
        const includePurchasePrice = this.includePurchasePrice(req)
        const { data } = req.query
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const permissions = userPermissions(req)
        const { products } = await this.ProductService.searchProducts(data, page, limit, includePurchasePrice)
        res.status(200).json( { products, permissions } )
    })

    /**
     * Retrieve the total number of pages for the product list.
     * * @async
     * @param {import('express').Request} req - Express request object.
     * @param {Object} req.query - Query parameters.
     * @param {string} [req.query.limit] - Max number of items per page (defaults to 10).
     * @param {string} [req.query.data] - Search term to filter results.
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>} Sends a JSON response with the total page count.
     */
    totalPages = this.#error.handler( async(req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const { data } = req.query || ''
        const total = await this.ProductService.totalPages(data, limit)
        res.status(500).json({total})
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

    includePurchasePrice(req) {
        const userRole = getUserRole(req.user.role)
        let includePurchasePrice = false
        if (['ADMIN', 'STORE_OWNER', 'MANAGER'].includes(userRole)) {
            includePurchasePrice = true
        }
        return includePurchasePrice
    }

    
}

export default ProductController
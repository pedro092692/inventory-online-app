import { Router } from 'express'
import ProductController from '../Controllers/ProductController.js'
import { authenticated } from '../middlewares/authMiddleware.js'

class ProductRoutes {
    constructor(){
        this.router = Router()
        this.router.use(authenticated)
        this.router.use(this.setRoutesModels.bind(this))
        this.initializeRoutes()
    }
    /**
     * Initializes the routes for the Product API.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => res.send('Product routes'))
        this.router.get('/all', (req, res) => new ProductController(req.Product, req.Dollar).allProducts(req, res))
        this.router.get('/search', (req, res) => new ProductController(req.Product, req.Dollar).searchProducts(req, res))
        this.router.get('/:id', (req, res) => new ProductController(req.Product, req.Dollar).getProduct(req, res))
        this.router.post('/', (req, res) => new ProductController(req.Product).createProduct(req, res))
        this.router.patch('/:id', (req, res) => new ProductController(req.Product).updateProduct(req, res))
        this.router.delete('/', (req, res) => new ProductController(req.Product).deleteProduct(req, res))
    }

    /**
     * Middleware to attach the `Product` and `Dollar` models from the tenant-specific models to the request object.
     *
     * This method extracts the `Product` and `Dollar` models from `req.tenantModels` 
     * and assigns it to `req.Product` and `req.Dollar`.
     * If any of the models are missing, it responds with a 400 Bad Request.
     * Otherwise, it passes control to the next middleware.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    async setRoutesModels(req, res, next) {
        const {Product, Dollar} = req.tenantModels
        if(!Dollar || !Product) {
            return res.status(400).json({ message: 'Dollar and Product models are required' })
        }
        req.Product = Product
        req.Dollar = Dollar
        next()
    }
}

export default ProductRoutes
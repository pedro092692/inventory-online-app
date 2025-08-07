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
        this.router.get('/all', (req, res) => new ProductController(req.Product).allProducts(req, res))
        this.router.get('/:id', (req, res) => new ProductController(req.Product, req.Dollar).getProduct(req, res))
        this.router.post('/', (req, res) => new ProductController(req.Product).createProduct(req, res))
        this.router.patch('/:id', (req, res) => new ProductController(req.Product).updateProduct(req, res))
        this.router.delete('/', (req, res) => new ProductController(req.Product).deleteProduct(req, res))
    }

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
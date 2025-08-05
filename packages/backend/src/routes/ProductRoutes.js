import { Router } from 'express'
import ProductController from '../Controllers/ProductController.js'
import {Product} from '../models/inventory_models/ProductModel.js'
import { Dollar } from '../models/inventory_models/DollarModel.js'

class ProductRoutes {
    constructor(){
        this.router = Router()
        this.initializeRoutes()
    }
    /**
     * Initializes the routes for the Product API.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => res.send('Product routes'))
        this.router.get('/all', (req, res) => new ProductController(Product).allProducts(req, res))
        this.router.get('/:id', (req, res) => new ProductController(Product, Dollar).getProduct(req, res))
        this.router.post('/', (req, res) => new ProductController(Product).createProduct(req, res))
        this.router.patch('/:id', (req, res) => new ProductController(Product).updateProduct(req, res))
        this.router.delete('/', (req, res) => new ProductController(Product).deleteProduct(req, res))
    }
}

export default ProductRoutes
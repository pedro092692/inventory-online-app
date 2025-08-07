import { Router } from 'express'
import SellerController from '../Controllers/SellerController.js'
import { authenticated } from '../middlewares/authMiddleware.js'

class SellerRoutes{
    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.router.use(this.setRoutesModels.bind(this))
        this.inicializateRoutes()
    }  
    /**
     * Initializes the routes for the Seller API.
     * @returns {void}
     */
    inicializateRoutes() {
        this.router.get('/', (req, res) => res.send('Seller routes'))
        this.router.get('/all', (req, res) => new SellerController(req.Seller).allSeller(req, res))
        this.router.get('/:id', (req, res) => new SellerController(req.Seller).getSeller(req, res))
        this.router.post('/', (req, res) => new SellerController(req.Seller).createSeller(req, res))
        this.router.patch('/:id', (req, res) => new SellerController(req.Seller).updateSeller(req, res))
        this.router.delete('/', (req, res) => new SellerController(req.Seller).deleteSeller(req, res))
    }

    async setRoutesModels(req, res, next) {
        const {Seller} = req.tenantModels
        if(!Seller) {
            return res.status(400).json({ message: 'Seller model is required' })
        }
        req.Seller = Seller
        next()
    }
}

export default SellerRoutes 
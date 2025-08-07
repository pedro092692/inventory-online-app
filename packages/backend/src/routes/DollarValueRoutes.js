import { Router } from 'express'
import DollarValueController from '../Controllers/DollarController.js'
import { authenticated } from '../middlewares/authMiddleware.js'

class DollarValueRoutes{
    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.router.use(this.setRoutesModels.bind(this))
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for the Dollar Value API.
     * @returns {void}
     */
    initializeRoutes() {    
        this.router.get('/', (req, res) => res.send('Dollar Value Routes'))
        this.router.post('/', (req, res) => new DollarValueController(req.Dollar).createDollarValue(req, res))
        this.router.get('/latest', (req, res) => new DollarValueController(req.Dollar).getLastValue(req, res))
        this.router.patch('/', (req, res) => new DollarValueController(req.Dollar).updateDollarValue(req, res))
        this.router.delete('/', (req, res) => new DollarValueController(req.Dollar).deleteDollarValue(req, res))
    }

    async setRoutesModels(req, res, next) {
        const {Dollar} = req.tenantModels
        if(!Dollar) {
            return res.status(400).json({ message: 'Dollar model is required' })
        }
        req.Dollar = Dollar
        next()
    }
}

export default DollarValueRoutes
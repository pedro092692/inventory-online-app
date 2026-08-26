import { Router } from 'express'
import StoreStatusController from '../Controllers/StoreStatusController.js'
import { authenticated } from '../middlewares/authMiddleware.js'

class StoreStatusRoutes {
    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for the Store Status API.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/status', (req, res) => new StoreStatusController().getStatus(req, res))
    }
}

export default StoreStatusRoutes

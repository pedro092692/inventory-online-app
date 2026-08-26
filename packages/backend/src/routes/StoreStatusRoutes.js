import { Router } from 'express'
import StoreStatusController from '../Controllers/StoreStatusController.js'
import { authenticated } from '../middlewares/authMiddleware.js'
import { validateFields } from '../validators/fieldValidator.js'
import multer from 'multer'

class StoreStatusRoutes {
    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.storage = multer.memoryStorage()
        this.upload = multer({ storage: this.storage, limits: { fileSize: 5 * 1024 * 1024 } })
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for the Store (self-service) API: active status,
     * store overview/health, and subscription payment submission/history.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/status', (req, res) => new StoreStatusController().getStatus(req, res))
        this.router.get('/me', (req, res) => new StoreStatusController().getMyStore(req, res))
        this.router.post('/payments', this.upload.single('receipt'), validateFields('submitPayment'), (req, res) => new StoreStatusController().submitPayment(req, res))
        this.router.get('/payments', (req, res) => new StoreStatusController().getMyPayments(req, res))
    }
}

export default StoreStatusRoutes

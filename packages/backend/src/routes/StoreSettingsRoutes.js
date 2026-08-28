import { Router } from 'express'
import StoreSettingsController from '../Controllers/StoreSettingsController.js'
import { authenticated } from '../middlewares/authMiddleware.js'
import { authorization } from '../middlewares/authorization.js'
import { PERMISSIONS } from '../constants/roles.js'

class StoreSettingsRoutes {
    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.router.use(this.setRoutesModels.bind(this))
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for the Store Settings API.
     *
     * GET is open to any authenticated role — the vendedor role needs it too, to know
     * whether to apply the buffer rate on the Cotizar screen. PATCH requires UPDATE
     * (ADMIN/STORE_OWNER/MANAGER), same restriction as the catalog/Divisa screens.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => new StoreSettingsController(req.StoreSettings).getSettings(req, res))
        this.router.patch('/', authorization(PERMISSIONS.UPDATE), (req, res) => new StoreSettingsController(req.StoreSettings, req.Dollar).updateSettings(req, res))
    }

    /**
     * Middleware to attach the `StoreSettings` and `Dollar` models from the tenant-specific
     * models to the request object.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    async setRoutesModels(req, res, next) {
        const { StoreSettings, Dollar } = req.tenantModels
        if (!StoreSettings) {
            return res.status(400).json({ message: 'StoreSettings model is required' })
        }
        req.StoreSettings = StoreSettings
        req.Dollar = Dollar
        next()
    }
}

export default StoreSettingsRoutes

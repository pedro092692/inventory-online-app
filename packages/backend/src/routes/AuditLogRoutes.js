import { Router } from 'express'
import AuditLogController from '../Controllers/AuditLogController.js'
import { authenticated } from '../middlewares/authMiddleware.js'

class AuditLogRoutes {
    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.router.use(this.setRoutesModels.bind(this))
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for the Audit Log API.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => res.send('Audit log routes'))
        this.router.get('/all', (req, res) => new AuditLogController(req.AuditLog).allAuditLogs(req, res))
        this.router.get('/total-pages', (req, res) => new AuditLogController(req.AuditLog).totalPages(req, res))
    }

    /**
     * Middleware to attach the `AuditLog` model from the tenant-specific models to the request object.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    async setRoutesModels(req, res, next) {
        const { AuditLog } = req.tenantModels
        if (!AuditLog) {
            return res.status(400).json({ message: 'AuditLog model is required' })
        }
        req.AuditLog = AuditLog
        next()
    }
}

export default AuditLogRoutes

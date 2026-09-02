import ControllerErrorHandler from '../errors/controllerErrorHandler.js'
import Database from '../database/database.js'
import SecurityService from '../services/admin/SecurityService.js'
import StoreStatusService from '../services/StoreStatusService.js'



/**
 * @class AuthMiddleware
 * @description Provides middleware for handling authentication.
 */
class AuthMiddleware {
    
    #error = new ControllerErrorHandler()
    
    constructor() {
        this.db = new Database()
        this.security = new SecurityService()
        this.storeStatus = new StoreStatusService()
    }
    
    /**
     * Express middleware to verify a JWT from a cookie and set the correct tenant path for the logged-in user.
     * It checks for a cookie named `access_token`. If the token is present and valid,
     * it decodes the payload, attaches it to `req.user`, and passes control to the next middleware.
     * If the token is missing or invalid, it sends a 403 or 401 response, respectively.
     * This method is wrapped with a controller error handler to catch unexpected errors.
     * @type {import('express').RequestHandler}
     */
    authenticatedToken = this.#error.handler(async(req, res, next) => {
        const token = req.cookies.access_token
        // check if token is present
        if (!token) {
            return res.status(403).json({message: 'Access denied.'})
        }

        // verity token 
        const data = await this.security.verityToken(token)

        if(!data) {
            return res.status(401).json({message: 'Invalid or expired token.'})
        }

        req.user = data
        // set tenant path 
        const tenant = await this.db.tenant.TenantConnection(req.user.tenant_id)
        req.tenantModels = tenant.models
        req.sequelize = tenant.sequelize
        next()
    })

    /**
     * Express middleware to verify if the user has admin privileges.
     * 
     * It checks for a user in the request payload and verifies the role.
     * if the role is admin (`role === 1`), it continues to the next middleware.
     * If the role is invalid or missing, it sends a 403 or 401 response, respectively.
     * This method is wrapped with a controller error handler to catch unexpected errors.
     * @type {import('express').RequestHandler}
     */
    isAdmin = this.#error.handler((req, res, next) => {
        if(!req.user) {
            res.status(401).json({message: 'Unauthorized'})
        }

        const role = req.user.role
        if(role == 1) {
            return next()
        }

        res.status(403).json({ message: 'Forbidden' })
    })
    
    /**
     * Express middleware to verify if the user is the platform's super-admin.
     *
     * It checks for a user in the request payload and requires both `role === 1` (admin)
     * and `is_super_admin === true` — a flag on the users row, not a hardcoded user id, so
     * it survives a database reset (which would otherwise silently reassign a hardcoded
     * `id === 1` check to whoever gets that id next) and lets more than one account hold
     * this privilege in the future without a code change.
     * If the user isn't a super-admin, it sends a 403 or 401 response, respectively.
     * This method is wrapped with a controller error handler to catch unexpected errors.
     * @type {import('express').RequestHandler}
     */
    isSuperAdmin = this.#error.handler((req, res, next) => {
        if(!req.user) {
            return res.status(401).json({message: 'Unauthorized'})
        }

        if(req.user.role == 1 && req.user.is_super_admin === true) {
            return next()
        }

        res.status(403).json({ message: 'Forbidden' })
    })

    /**
     * Express middleware to verify if the user has admin or owner privileges.
     *
     * It checks for a user in the request payload and verifies the role.
     * if the role is admin (`role === 1` or `role === 2`), it continues to the next middleware.
     * If the role is invalid or missing, it sends a 403 or 401 response, respectively.
     * This method is wrapped with a controller error handler to catch unexpected errors.
     * @type {import('express').RequestHandler}
     */
    isOwner = this.#error.handler((req, res, next) => {
        if(!req.user) {
            res.status(401).json({message: 'Unauthorized'})
        }

        const role = req.user.role
        if(role == 1 || role == 2) {
            return next()
        }

        res.status(403).json({ message: 'Forbidden' })
    })

    /**
     * Express middleware to block actions that "move" the business (sell, pay, register/edit
     * products, return products, refund payments) when the tenant's store is inactive —
     * either because the admin blocked it (`is_active = false`) or because its subscription
     * expired (`subscription_expires_at` in the past).
     *
     * Read-only routes (viewing products, invoices, reports, etc.) are NOT protected by this
     * middleware on purpose — a blocked/expired store can still see its own data.
     *
     * If the user has no `tenant_id` (e.g. an admin hitting these routes directly) or has no
     * Store row yet, it lets the request through — this middleware only blocks known-inactive stores.
     *
     * @type {import('express').RequestHandler}
     */
    requireActiveStore = this.#error.handler(async (req, res, next) => {
        const tenantId = req.user?.tenant_id

        if (!tenantId) {
            return next()
        }

        const { active, reason } = await this.storeStatus.getStatus(tenantId)

        if (!active) {
            return res.status(403).json({ message: reason })
        }

        next()
    })

}

const authenticated = new AuthMiddleware().authenticatedToken
const isAdmin = new AuthMiddleware().isAdmin
const isSuperAdmin = new AuthMiddleware().isSuperAdmin
const isOwner = new AuthMiddleware().isOwner
const requireActiveStore = new AuthMiddleware().requireActiveStore

export { authenticated, isAdmin, isSuperAdmin, isOwner, requireActiveStore }
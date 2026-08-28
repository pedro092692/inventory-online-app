import AuditLogService from '../services/AuditLogService.js'
import controllerErrorHandler from '../errors/controllerErrorHandler.js'
import { getUserRole } from '../middlewares/authorization.js'

// Only roles that oversee the store (not the regular cashier/"USER" login) can read the
// audit trail — it records when a supervisor authorized a payment cancellation or a
// product return, which is exactly the kind of thing a plain cashier account shouldn't
// be able to browse.
const ALLOWED_ROLES = ['ADMIN', 'STORE_OWNER', 'MANAGER']

class AuditLogController {
    #error = new controllerErrorHandler()

    constructor(model) {
        this.auditLogService = new AuditLogService(model)
        this.#error
    }

    /**
     * Retrieves all audit log entries.
     * @param {Object} req - request object
     * @param {Object} res - response object to send the list of audit logs
     * @throws {ServiceError} - throws an error if the audit logs could not be retrieved
     * @returns {Promise<void>} - returns the list of audit logs in the response
     */
    allAuditLogs = this.#error.handler(async (req, res) => {
        if (!this.canViewAuditLogs(req)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'No tienes permiso para ver el registro de auditoría'
            })
        }

        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const { auditLogs } = await this.auditLogService.getAllAuditLogs(limit, page)
        res.status(200).json({ auditLogs })
    })

    /**
     * Retrieve the total number of pages for the audit log listing.
     * @param {import('express').Request} req - Express request object.
     * @param {Object} req.query - Query parameters.
     * @param {string} [req.query.limit] - Max number of items per page (defaults to 10).
     * @param {import('express').Response} res - Express response object.
     * @returns {Promise<void>} Sends a JSON response with the total page count.
     */
    totalPages = this.#error.handler(async (req, res) => {
        if (!this.canViewAuditLogs(req)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'No tienes permiso para ver el registro de auditoría'
            })
        }

        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const total = await this.auditLogService.totalPages(limit)
        res.status(200).json({ total })
    })

    /**
     * Checks whether the requesting user's role is allowed to view the audit trail.
     * @param {Object} req - The request object.
     * @param {Object} req.user - The authenticated user's credentials.
     * @param {string} req.user.role - The user's role.
     * @returns {boolean} true if the user's role can view audit logs.
     */
    canViewAuditLogs(req) {
        const userRole = getUserRole(req.user.role)
        return ALLOWED_ROLES.includes(userRole)
    }
}

export default AuditLogController

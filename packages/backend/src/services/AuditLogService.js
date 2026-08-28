import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'
import { NotFoundError } from '../errors/NofoundError.js'
import { sequelize } from '../database/database.js'


class AuditLogService {
    // instace of error handler
    #error = new ServiceErrorHandler()

    constructor(auditLogModel) {
        this.AuditLogModel = auditLogModel
        this.#error
    }

    /**
     * Creates new audit log entry.
     * @param {Object} logData - The data for the new audit log entry.
     * @param {string} logData.action - The action performed (e.g., 'CREATE', 'UPDATE', 'DELETE').
     * @param {string} logData.tableName - The name of the database table affected by the action.
     * @param {number|string} logData.recordId - The ID of the record affected by the action.
     * @param {Object} logData.details - An object containing the old and new snapshots of the record (optional).
     * @param {number} logData.userId - The ID of the user who performed the action.
     * @param {number|null} logData.supervisor_seller_id - The ID of the supervisor seller who authorized the action, if applicable (optional).
     * @param {Object} options - Options for the database transaction.
     * @return {Promise<Object>} - A promise that resolves to an object of created audit log entry.
     * @throws {ServiceError} - If an error occurs during audit log creation.
     */
    createAuditLog({action, tableName, recordId, details = {}, userId, supervisor_seller_id = null}, options = {}) {
        return this.#error.handler(['Create Audit Log'], async() => {
            const newLog = await this.AuditLogModel.create({
                action,
                table_name: tableName,
                record_id: recordId,
                old_value: details.oldSnapshot || null,
                new_value: details.newSnapshot ||null,
                user_id: userId,
                supervisor_seller_id: supervisor_seller_id
            },
            {
                transaction: options.transaction || null
            })
            return {
                auditLog: newLog
            }
        })
    }

    /**
     * Retrieves all audit log entries, newest first, with the acting user's email and
     * (when the action was authorized by a supervisor's PIN) the supervisor's name.
     * @param {number} [limit=10] - Max number of entries to return.
     * @param {number} [page=1] - Page number.
     * @returns {Promise<{auditLogs: Array}>} - A promise that resolves to the paginated audit logs.
     * @throws {ServiceError} - If an error occurs during retrieval.
     */
    getAllAuditLogs(limit = 10, page = 1) {
        const offset = (page - 1) * limit
        return this.#error.handler(['Read All Audit Logs'], async () => {
            const auditLogs = await this.AuditLogModel.findAll({
                include: [
                    {
                        association: 'user',
                        attributes: ['email'],
                        paranoid: false,
                    },
                    {
                        association: 'supervisorSeller',
                        attributes: ['name', 'last_name'],
                        paranoid: false,
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: limit,
                offset: offset
            })

            return {
                auditLogs: auditLogs
            }
        })
    }

    /**
     * Calculates the total number of pages for the audit log listing based on a page limit.
     * @param {number} [limit=10] - The number of records to display per page.
     * @returns {Promise<number>} A promise that resolves to the total number of calculated pages.
     * @throws Will be handled by the internal error handler.
     */
    totalPages(limit = 10) {
        return this.#error.handler(['Total pages', 'AuditLog'], async () => {
            const count = await this.AuditLogModel.count()
            return Math.ceil(count / limit)
        })
    }
}

export default AuditLogService
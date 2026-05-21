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
}

export default AuditLogService
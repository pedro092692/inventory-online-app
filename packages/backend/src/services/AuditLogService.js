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

    createAuditLog(action, tableName, recordId, details = {}, userId, supervisor_seller_id = null, options = {}) {
        return this.#error.handler(['Create Audit Log'], async() => {
            const newLog = await this.AuditLogModel.create({
                action,
                table_name: tableName,
                record_id: recordId,
                old_value: details.oldValue || null,
                new_value: details.newValue ||null,
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
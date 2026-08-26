import StoreStatusService from '../services/StoreStatusService.js'
import ControllerErrorHandler from '../errors/controllerErrorHandler.js'

class StoreStatusController {
    #error = new ControllerErrorHandler()

    constructor() {
        this.storeStatus = new StoreStatusService()
        this.#error
    }

    /**
     * Retrieves the active status of the current user's store (active/inactive + reason).
     * @param {Object} req - request object, uses the authenticated user's tenant_id
     * @param {Object} res - response object to send the store status
     * @throws {ServiceError} - throws an error if the status could not be retrieved
     * @returns {Promise<void>} - returns {active, reason} in the response
     */
    getStatus = this.#error.handler( async(req, res) => {
        const tenantId = req.user?.tenant_id
        const status = await this.storeStatus.getStatus(tenantId)
        res.status(200).json(status)
    })
}

export default StoreStatusController

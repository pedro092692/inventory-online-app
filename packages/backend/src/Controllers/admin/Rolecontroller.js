import RoleService from '../../services/admin/RoleService.js'
import ControllerErrorHandler from '../../errors/controllerErrorHandler.js'

class RoleController {
    // new instance of controller error handler 
    #error = new ControllerErrorHandler()

    constructor() {
        this.Role = new RoleService()
        this.#error
    }
    
    /**
     * Creates a new role.
     * @param {Object} req - request object containing the role name in the body
     * @param {Object} res - response object to send the created role
     * @throws {ServiceError} - throws an error if the role could not be created
     * @returns {Promise<void>} - returns the created role in the response
     */
    createRole = this.#error.handler( async(req, res) => {
        const { name } = req.body
        const role = await this.Role.createRole(name)
        res.status(200).json(role)
    })

    /**
     * Retrieves all roles.
     * @param {Object} req - request object
     * @param {Object} res - response object to send the list of roles
     * @throws {ServiceError} - throws an error if the roles could not be retrieved
     * @returns {Promise<void>} - returns the list of roles in the response
     */ 
    getAllRoles = this.#error.handler( async(req, res) => {
        const roles = await this.Role.getAllRoles()
        res.status(200).json(roles)
    })

    /**
     * Retrieves a role by its ID.
     * @param {Object} req - request object containing the role ID in the params
     * @param {Object} res - response object to send the role details
     * @throws {ServiceError} - throws an error if the role could not be found
     * @returns {Promise<void>} - returns the role details in the response
     */
    getRole = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const role = await this.Role.getRole(id)
        res.status(200).json(role)
    })

    /**
     * Updates a role by its ID.
     * @param {Object} req - request object containing the role ID and updates in the body
     * @param {Object} res - response object to send the updated role
     * @throws {ServiceError} - throws an error if the role could not be updated
     * @returns {Promise<void>} - returns the updated role in the response
     */
    updateRole = this.#error.handler( async(req, res) => {
        const roleId = req.body.roleId
        const updates = req.body.updates
        const updatedRole = await this.Role.updateRole(roleId, updates)
        res.status(200).json(updatedRole)
    })

    /**
     * Deletes a role by its ID.
     * @param {Object} req - request object containing the role ID in the body
     * @param {Object} res - response object to send a success status
     * @throws {ServiceError} - throws an error if the role could not be deleted
     * @returns {Promise<void>} - returns a 204 status on successful deletion
     */
    deleteRole = this.#error.handler( async(req, res) => {
        const roleId = req.body.roleId
        // delete role
        await this.Role.deleteRole(roleId)
        res.status(204).json({})
    })
}

export default RoleController
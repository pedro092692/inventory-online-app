import { NotFoundError } from '../../errors/NofoundError.js';
import ServiceErrorHandler from '../../errors/ServiceErrorHandler.js';
import { Role } from '../../models/RoleModel.js'

class RoleService {
    // new instace of service error handler 
    #error = new ServiceErrorHandler()
    
    constructor() {
        this.#error
    }

    /**
     * Create a new role
     * @param {string} name - The name of the role
     * @returns {Promise<Role>} - The created role
     */
    createRole(name) {
        return this.#error.handler(['Create Role'], async() => {
            const newRole = Role.create({
                name: name
            })
            return newRole
        })
    }

    /**
     * Retrieves all roles with pagination.
     * @param {number} limit - The maximum number of roles to retrieve.
     * @param {number} offset - The number of roles to skip before starting to retrieve.
     * @return {Promise<Array>} - A promise that resolves to an array of role objects.
     * @throws {ServiceError} - If an error occurs during role retrieval.
     */
    getAllRoles(limit=10, offset=0) {
        return this.#error.handler(['Read All Roles'], async() => {
            const roles = await Role.findAll({
                limit: limit,
                offset: offset
            })
            return roles
        })
    }

    /**
     * Retrieves a role by its ID.
     * @param {number} id - The ID of the role to retrieve.
     * @return {Promise<Role>} - A promise that resolves to the role object.
     * @throws {NotFoundError} - If the role is not found.
     */
    getRole(id) {
        return this.#error.handler(['Read Role', id, 'Role'], async() => {
            const role = await Role.findByPk(id)
            if(!role) {
                throw new NotFoundError()
            }
            return role
        })
    }

    /**
     * Updates a role by its ID.
     * @param {number} roleId - The ID of the role to update.
     * @param {Object} updates - The updates to apply to the role.
     * @return {Promise<Role>} - A promise that resolves to the updated role object.
     * @throws {NotFoundError} - If the role is not found.
     */
    updateRole(roleId, updates) {
        return this.#error.handler(['Update Role', roleId, 'Role'], async() => {
            const role = await this.getRole(roleId)
            const updatedRole = await role.update(updates)
            return updatedRole
        })
    }

    /**
     * Deletes a role by its ID.
     * @param {number} roleId - The ID of the role to delete.
     * @return {Promise<number>} - A promise that resolves to the number of deleted roles (1 if successful).
     * @throws {NotFoundError} - If the role is not found.
     */
    deleteRole(roleId) {
        return this.#error.handler(['Delete Role', roleId, 'Role'], async() => {
            const role = await this.getRole(roleId)
            // delete role 
            await role.destroy()
            return 1
        })
    }
}

export default RoleService
import { NotFoundError } from "../../errors/NofoundError.js";
import ServiceErrorHandler from "../../errors/ServiceErrorHandler.js";
import { Role } from "../../models/RoleModel.js"

class RoleService {
    // new instace of service error handler 
    #error = new ServiceErrorHandler()
    
    constructor() {
        this.#error
    }

    createRole(name) {
        return this.#error.handler(["Create Role"], async() => {
            const newRole = Role.create({
                name: name
            })
            return newRole
        })
    }

    getAllRoles(limit=10, offset=0) {
        return this.#error.handler(["Read All Roles"], async() => {
            const roles = await Role.findAll({
                limit: limit,
                offset: offset
            })
            return roles
        })
    }

    getRole(id) {
        return this.#error.handler(["Read Role", id, "Role"], async() => {
            const role = await Role.findByPk(id)
            if(!role) {
                throw new NotFoundError()
            }
            return role
        })
    }

    updateRole(roleId, updates) {
        return this.#error.handler(["Update Role", roleId, "Role"], async() => {
            const role = await this.getRole(roleId)
            const updatedRole = await role.update(updates)
            return updatedRole
        })
    }
}

export default RoleService
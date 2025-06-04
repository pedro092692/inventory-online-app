import { NotFoundError } from "../../errors/NofoundError.js";
import ServiceErrorHandler from "../../errors/ServiceErrorHandler.js";
import { Role } from "../../models/RoleModel.js"

class RoleService {
    // new instace of service error handler 
    #error = new ServiceErrorHandler()
    
    constructor() {
        this.#error
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
}

export default RoleService
import RoleService from "../../services/admin/RoleService.js"
import ControllerErrorHandler from "../../errors/controllerErrorHandler.js"

class RoleController {
    // new instance of controller error handler 
    #error = new ControllerErrorHandler()

    constructor() {
        this.Role = new RoleService()
        this.#error
    }

    getAllRoles = this.#error.handler( async(req, res) => {
        const roles = await this.Role.getAllRoles()
        res.status(200).json(roles)
    })
}

export default RoleController
import RoleService from "../../services/admin/RoleService.js"
import ControllerErrorHandler from "../../errors/controllerErrorHandler.js"

class RoleController {
    // new instance of controller error handler 
    #error = new ControllerErrorHandler()

    constructor() {
        this.Role = new RoleService()
        this.#error
    }

    createRole = this.#error.handler( async(req, res) => {
        const { name } = req.body
        const role = await this.Role.createRole(name)
        res.status(200).json(role)
    })


    getAllRoles = this.#error.handler( async(req, res) => {
        const roles = await this.Role.getAllRoles()
        res.status(200).json(roles)
    })

    getRole = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const role = await this.Role.getRole(id)
        res.status(200).json(role)
    })

    updateRole = this.#error.handler( async(req, res) => {
        const roleId = req.body.roleId
        const updates = req.body.updates
        const updatedRole = await this.Role.updateRole(roleId, updates)
        res.status(200).json(updatedRole)
    })

    deleteRole = this.#error.handler( async(req, res) => {
        const roleId = req.body.roleId
        // delete role
        await this.Role.deleteRole(roleId)
        res.status(204).json({message: "Role has been deleted"})
    })
}

export default RoleController
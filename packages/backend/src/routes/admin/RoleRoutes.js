import { Router } from "express"
import RoleController from "../../Controllers/admin/Rolecontroller.js"

class RoleRoutes {
    constructor() {
        this.router = Router()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get("/", (req, res) => res.send("Roles Routes"))
        this.router.get("/all", (req, res) => new RoleController().getAllRoles(req, res))
        this.router.get("/:id", (req, res) => new RoleController().getRole(req, res))
        this.router.post("/", (req, res) => new RoleController().createRole(req, res))
    }
}

export default RoleRoutes
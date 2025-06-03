import { Router } from "express"
import UserController from "../Controllers/UserController.js"

class UserRoutes {
    constructor(){
        this.router = Router()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get("/", (req, res) => res.send("User routes"))
        this.router.get("/all", (req, res) => new UserController().getAllUsers(req,))
    }
}

export default UserRoutes
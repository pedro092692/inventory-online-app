import { Router } from "express"
import UserController from "../Controllers/UserController.js"

class UserRoutes {
    constructor(){
        this.router = Router()
        this.UserController = new UserController()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get("/", (req, res) => res.send("User routes"))
    }
}

export default UserRoutes
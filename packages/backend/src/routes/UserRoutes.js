import { Router } from "express"
import UserController from "../Controllers/UserController.js"

class UserRoutes {
    constructor(){
        this.router = Router()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get("/", (req, res) => res.send("User routes"))
        this.router.get("/all", (req, res) => new UserController().getAllUsers(req, res))
        this.router.get("/:id", (req, res) => new UserController().getUser(req, res))
        this.router.post("/", (req, res) => new UserController().createUser(req, res))
        this.router.patch("/", (req, res) => new UserController().updateUser(req, res))
    }
}

export default UserRoutes
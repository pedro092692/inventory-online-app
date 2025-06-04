import UserService from "../services/UserService.js"
import controllerErrorHandler from "../errors/controllerErrorHandler.js"

class UserController {
    // new instance of controller error handler 
    #error = new controllerErrorHandler()

    constructor(){
        this.User = new UserService()
        this.#error
    }

    createUser = this.#error.handler( async(req, res) => {
        const { email, password, roleId } = req.body
        const user = await this.User.createUser(email, password, roleId)
        res.status(201).json(user)
    })
    

    getAllUsers = this.#error.handler( async(req, res) => {
        const users = await this.User.getAllUser()
        res.status(200).json(users)
    })

    getUser = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const user = await this.User.getUser(id)
        res.status(200).json(user)
    })
}

export default UserController
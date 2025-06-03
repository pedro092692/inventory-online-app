import UserService from "../services/UserService.js"
import controllerErrorHandler from "../errors/controllerErrorHandler.js"

class UserController {
    // new instance of controller error handler 
    #error = new controllerErrorHandler()

    constructor(){
        this.User = new UserService()
        this.#error
    }
    

    getAllUsers = this.#error.handler( async(req, res) => {
        const users = await this.User.getAllUser()
        res.status(200).json(users)
    })
}

export default UserController
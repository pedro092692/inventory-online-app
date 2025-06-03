import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import { User } from "../models/UserModel.js"

class UserService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor() {
        this.#error
    }

    getAllUser(limit, offset) {
        return this.#error.handler(["Read All Users"], async() => {
            const users = User.findAll({
                limit: limit,
                offset: offset
            })
            return users
        })
    }

    getUser(id) {
        return this.#error.handler(["Read user", id, "User"], async() => {
            const user = await this.User.findByPk(id)
            return user
        })
    }

}

export default UserService
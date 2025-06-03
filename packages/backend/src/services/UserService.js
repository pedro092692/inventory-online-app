import { NotFoundError } from "../errors/NofoundError.js"
import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import { User } from "../models/UserModel.js"

class UserService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor() {
        this.#error
    }

    createUser(email, password, roleId) {
        return this.#error.handler(["Create User"], async() => {
            const newUser = await User.create({
                email: email,
                password: password,
                roleId: roleId
            })

            const user = {...newUser.toJSON()}
            user.delete.password
            return user
        })  
    }

    getAllUser(limit=10, offset=0) {
        return this.#error.handler(["Read All Users"], async() => {
            const users = await User.findAll({
                limit: limit,
                offset: offset
            })
            return users
        })
    }

    getUser(id) {
        return this.#error.handler(["Read user", id, "User"], async() => {
            const user = await User.findByPk(id)
            if(!user) {
                throw new NotFoundError()
            }
            return user
        })
    }

}

export default UserService
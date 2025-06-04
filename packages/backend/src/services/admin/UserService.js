import { NotFoundError } from "../../errors/NofoundError.js"
import ServiceErrorHandler from "../../errors/ServiceErrorHandler.js"
import { User } from "../../models/UserModel.js"

class UserService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor() {
        this.#error
    }

    createUser(email, password, roleId) {
        return this.#error.handler(["Create user"], async() => {
            const newUser = await User.create({
                email: email,
                password: password,
                roleId: roleId
            })
            const user = this.detelePassword(newUser)
            return user
        })
    }

    getAllUser(limit=10, offset=0) {
        return this.#error.handler(["Read All Users"], async() => {
            const users = await User.findAll({
                attributes: ["id", "email", "roleId"],
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

    updateUser(userId, updates) {
        return this.#error.handler(["Update User", userId, "User"], async() => {
            const user = await this.getUser(userId)
            const updatedUser = await user.update(updates)
            const safeUser = this.detelePassword(updatedUser)
            return safeUser
        })
    }

    deleteUser(userId) {
        return this.#error.handler(["Delete User", userId, "User"], async() => {
            const user = await this.getUser(userId)
            //delete user
            await user.destroy()
            return 1
        })
    }

    detelePassword(obj) {
        const objNotPassword ={...obj.toJSON()}
        delete objNotPassword.password
        return objNotPassword
    }

}

export default UserService
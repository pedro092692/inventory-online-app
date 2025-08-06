import UserService from '../../services/admin/UserService.js'
import ControllerErrorHandler from '../../errors/controllerErrorHandler.js'


class SecurityController {
    // new instance of controller error handler 
    #error = new ControllerErrorHandler()

    constructor() {
        this.user = new UserService()
        this.#error
    }

    /**
     * Retrieves a user by a given email.
     * @param {Object} req - request object.
     * @param {Object} res - response object to send the user info.
     * @throws {ServiceError} - throws an error if the users could not be retrieved.
     * @returns {Promise<void>} - returns the user data in the response.
     */
    findUser = this.#error.handler( async(req, res) => {
        const { email } = req.body
        const user = await this.user.findUserByEmail(email)

        if(!user) {
           return res.status(401).json({message: 'Invalid email or password.'})
        }

        res.status(200).json({message: 'User found!.'})
    })
}

export default SecurityController
import UserService from '../../services/admin/UserService.js'
import ControllerErrorHandler from '../../errors/controllerErrorHandler.js'
import SecurityService from '../../services/admin/SecurityService.js'


class SecurityController {
    // new instance of controller error handler 
    #error = new ControllerErrorHandler()

    constructor() {
        this.user = new UserService()
        this.security = new SecurityService()
        this.#error
    }

    /**
     * Retrieves a user by a given email.
     * and checks if the user exist and the password is the correct 
     * in case of user not found or invalid password return a status 401
     * @param {Object} req - request object.
     * @param {Object} res - response object to send the user info.
     * @throws {ServiceError} - throws an error if the users could not be retrieved.
     * @returns {Promise<void>} - returns the user data in the response.
     */
    login = this.#error.handler( async(req, res) => {
        const { email, password } = req.body
        const user = await this.user.findUserByEmail(email)

        if(!user || !await this.user._verifyPassword(user, password)) {
           return res.status(401).json({message: 'Invalid email or password.'})
        }
        // sign jwt token, create token
        const token = await this.security.setJwt(user)
        // send token 
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 
        })
        .status(200).json({message: 'Login successful'})
    })

    verifyToken = this.#error.handler( async(req, res) => {
        let token
        try {
            token = req.body.token
        } catch {
            token = req.cookies.access_token
        }
        const data = await this.security.verityToken(token)

        if(!data) {
            return res.status(401).json({message: 'Invalid token'})
        }

        res.status(200).json({data})
    }) 
}

export default SecurityController
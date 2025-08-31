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


    /**
     * Middleware-like handler that verifies the provided access token.
     *
     * It attempts to extract the token from the request body (`req.body.token`) first.
     * If not found, it falls back to the `access_token` cookie.  
     * The token is then validated using `this.security.verityToken()`.
     *
     * - If the token is invalid or missing, responds with HTTP 401 and a JSON error message.
     * - If the token is valid, responds with HTTP 200 and the decoded token data.
     *
     * @function verifyToken
     * @param {import("express").Request} req - Express request object containing the token in body or cookies.
     * @param {import("express").Response} res - Express response object used to return the verification result.
     * @returns {Promise<void>} A promise that resolves once the response has been sent.
     */
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

    /**
     * Checks whether a user is currently logged in by validating the presence of an access token.
     *
     * This method attempts to retrieve the `access_token` cookie from the request.
     * - If the cookie is missing, the user is considered not logged in and a `401 Unauthorized` response is returned.
     * - If the cookie exists, the user is considered logged in and a `200 OK` response is returned.
     *
     * @function isLogged
     * @param {import("express").Request} req - Express request object, expected to contain cookies.
     * @param {import("express").Response} res - Express response object used to send the login status.
     * @returns {Promise<void>} A promise that resolves once the HTTP response is sent.
     */
    isLogged = this.#error.handler( async(req, res) => {
        const token = req.cookies.access_token
        if(!token) {
            return res.status(401).json({message: 'not logged in'})
        }
        res.status(200).json({message: 'logged in'})
    })
}

export default SecurityController
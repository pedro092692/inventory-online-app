import ServiceErrorHandler from '../../errors/ServiceErrorHandler.js'
import jwt from 'jsonwebtoken'
import pkg from '../../config/config.js'
import process from 'process'

const currentEnv = process.env.NODE_ENV || 'development'
const jtw_secret = pkg[currentEnv].jtw_secret

class SecurityService {
    #error = new ServiceErrorHandler()

    constructor() {
        this.#error
    }

    /**
     * Creates and signs a JSON Web Token (JWT) for a given user.
     * The token contains the user's ID, email, and role, and expires in 1 hour.
     * @param {object} user - The user object for whom to generate the token.
     * @param {number} user.id - The user's ID.
     * @param {string} user.email - The user's email.
     * @param {object} user.Role - The user's role object, which should be included in the user query.
     * @param {string} user.Role.name - The name of the user's role.
     * @throws {ServiceError} - throws an error if the token could not be sign.
     * @returns {string} The generated JWT.
     */
    setJwt(user) {
        return this.#error.handler(['Set jwt'], async() => {
            const token = jwt.sign(
                {
                    id: user.id, 
                    email: user.email,
                    role: user.role_id,
                    tenant_id: user.tenant_id
                },
                jtw_secret,
                {
                    expiresIn: '1h'
                }
            )    
            return token
        })
    }

    /**
     * This method verifies a given JSON Web Token (JWT).
     * It checks if the token is provided and attempts to decode it using the secret key.
     * @param {string} token - The JWT to be verified.
     * @throws {Error} - Throws an error if the token is not provided. 
     * @returns {object|boolean} - Returns the decoded token data if verification is successful, or false if verification fails.
     * @throws {ServiceError} - Throws an error if the token verification fails.
     */
    verityToken(token) {
        return this.#error.handler(['Verity token'], async() => {
            if(!token) {
                throw new Error('Token is required')
            }

            try {
                const data = jwt.verify(token, jtw_secret)
                return {
                    id: data.id,
                    email: data.email,
                    role: data.role,
                    tenant_id: data.tenant_id
                }
            }catch {
                return false
            }
        }) 
    }
}


export default SecurityService
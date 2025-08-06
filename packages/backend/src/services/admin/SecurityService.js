import ServiceErrorHandler from '../../errors/ServiceErrorHandler'
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

    setJwt(user) {
        return this.#error.handler(['Set jwt'], () => {
            const token = jwt.sign(
                {
                    id: user.id, 
                    email: user.email,
                    role: user.role
                },
                jtw_secret,
                {
                    expiresIn: '1h'
                }
            )    
            return token
        })
    }
}


export default SecurityService
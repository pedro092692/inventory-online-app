import jwt from 'jsonwebtoken'
import ControllerErrorHandler from '../errors/controllerErrorHandler.js'
import pkg from '../config/config.js'
import process from 'process'
import Database from '../database/database.js'

const currentEnv = process.env.NODE_ENV || 'development'
const jtw_secret = pkg[currentEnv].jtw_secret

/**
 * @class AuthMiddleware
 * @description Provides middleware for handling authentication.
 */
class AuthMiddleware {
    
    #error = new ControllerErrorHandler()
    
    constructor() { 
        this.db = new Database()
    }
    
    /**
     * Express middleware to verify a JWT from a cookie and set the correct tenant path for the logged-in user.
     * It checks for a cookie named `access_token`. If the token is present and valid,
     * it decodes the payload, attaches it to `req.user`, and passes control to the next middleware.
     * If the token is missing or invalid, it sends a 403 or 401 response, respectively.
     * This method is wrapped with a controller error handler to catch unexpected errors.
     * @type {import('express').RequestHandler}
     */
    authenticatedToken = this.#error.handler(async(req, res, next) => {
        const token = req.cookies.access_token
        if (!token) {
            return res.status(403).json({message: 'Access denied.'})
        }
        
        try {
            const decoded = jwt.verify(token, jtw_secret)
            req.user = decoded
            
            // set tenant path 
            const tenant = await this.db.tenantConnection(req.user.tenant_id)
            
            req.tenantModels = tenant.models
            req.sequelize = tenant.sequelize
            next()
        } catch (error) {
            console.log(error)
            return res.status(401).json({message: 'Invalid or expired token.'})
        }
    })

    /**
     * Express middleware to verify if the user has admin privileges.
     * 
     * It checks for a user in the request payload and verifies the role.
     * if the role is admin (`role === 1`), it continues to the next middleware.
     * If the role is invalid or missing, it sends a 403 or 401 response, respectively.
     * This method is wrapped with a controller error handler to catch unexpected errors.
     * @type {import('express').RequestHandler}
     */
    isAdmin = this.#error.handler((req, res, next) => {
        if(!req.user) {
            res.status(401).json({message: 'Unauthorized'})
        }

        const role = req.user.role
        if(role == 1) {
            return next()
        }

        res.status(403).json({ message: 'Forbidden' })
    })

}

const authenticated = new AuthMiddleware().authenticatedToken
const isAdmin = new AuthMiddleware().isAdmin

export { authenticated, isAdmin }
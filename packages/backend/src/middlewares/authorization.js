import ControllerErrorHandler from '../errors/controllerErrorHandler.js'

/**
 * Authorization Middleware
 * @class AuthorizationMiddleware
 * @description Middleware class for handling authorization logic.
 */

class AuthorizationMiddleware {

    #error = new ControllerErrorHandler()

    constructor() {
        this.permissions = {
            1: ['read', 'write', 'update', 'delete'],
            2: ['read', 'write', 'update'],
            4: ['read','write'],
        }
    }

    /**
     * Express middleware to authorize users based on their roles and required permissions.
     * It checks if the user has the necessary permissions to access a resource.
     * @param {string} requiredPermission - The permission required to access the resource.
     * @type {import('express').RequestHandler}
     */
    
    authorize = (requiredPermission) => {
        return this.#error.handler((req, res, next) => {
            const userRole = req.user?.role 
            if (!userRole) {
                return res.status(401).json({
                    error: 'User not authorized',
                    message: 'User not authenticated'
                })
            }

            const userPermission = this.permissions[userRole] || []

            if (!userPermission.includes(requiredPermission)) {
                return res.status(403).json({
                    error: 'Forbidden',
                    message: 'You do not have permission to access this resource'
                })
            }

            next()

        })
    }
}

const authorization = new AuthorizationMiddleware().authorize
export { authorization }
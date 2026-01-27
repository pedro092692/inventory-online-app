import ControllerErrorHandler from '../errors/controllerErrorHandler.js'
import { ROLES, PERMISSIONS } from '../constants/roles.js'

/**
 * Authorization Middleware
 * @class AuthorizationMiddleware
 * @description Middleware class for handling authorization logic.
 */

class AuthorizationMiddleware {

    #error = new ControllerErrorHandler()

    constructor(permissions = null) {
        this.permissions = permissions || {
            [ROLES.ADMIN]: [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.DELETE, PERMISSIONS.UPDATE],
            [ROLES.STORE_OWNER]: [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.DELETE, PERMISSIONS.UPDATE],
            [ROLES.MANAGER]: [PERMISSIONS.READ, PERMISSIONS.WRITE,PERMISSIONS.UPDATE],
            [ROLES.USER]: [PERMISSIONS.READ, PERMISSIONS.WRITE],
        }
    }

    /**
     * Express middleware to authorize users based on their roles and required permissions.
     * It checks if the user has the necessary permissions to access a resource.
     * @param {string} requiredPermission - The permission required to access the resource.
     * @type {import('express').RequestHandler}
     */


    getUserPermission = (userRole) => {
        return this.permissions[userRole] || []
    }

    
    authorize = (requiredPermission) => {
        return this.#error.handler((req, res, next) => {
            const userRole = req.user?.role 
            if (!userRole) {
                return res.status(401).json({
                    error: 'User not authorized',
                    message: 'User not authenticated'
                })
            }
            
            const userPermission = this.getUserPermission(userRole)

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
const getUserPermission = new AuthorizationMiddleware().getUserPermission
export { authorization, getUserPermission }
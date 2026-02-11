import { NotFoundError } from './NofoundError.js'
import { ValidationError } from 'sequelize'

class ControllerErrorHandler { 
    
    /**
     * Wraps an asynchronous controller function to handle errors.
     * @param {Function} fn The asynchronous controller function to wrap.
     * @returns {Function} An Express middleware function that executes the controller function and catches any errors.
     */
    handler(fn) {
        return async (req, res, next) => {
            try {
                await fn(req, res, next)
            }catch(error) {
                this.controllerError(error, res)
            }
        }
    }

    /**
     * Handles specific error types and sends an appropriate HTTP response.
     * @param {Error} error The captured error object.
     * @param {import('express').Response} res The Express response object.
     * @returns {import('express').Response} The Express response object with a status and JSON payload.
     */
    controllerError(error, res) {
        if(error instanceof NotFoundError) {
            return res.status(404).json({error: error.message});
        }
        
        if(error instanceof ValidationError) {
            return res.status(400).json({error: error.message });
        }
        return res.status(500).json({ error: error.message })
    }
}

export default ControllerErrorHandler
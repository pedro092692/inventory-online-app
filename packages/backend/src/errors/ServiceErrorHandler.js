import { ValidationError } from 'sequelize'
import { NotFoundError } from './NofoundError.js'

class ServiceErrorHandler {

    /**
     * Wraps an asynchronous service function to provide centralized error handling.
     * @param {Array<string>} kwargs - An array of strings for constructing detailed error messages. e.g., `['creating resource', resourceId, 'Resource']`.
     * @param {Function} fn - The asynchronous service function to execute.
     * @returns {Promise<any>} The result of the wrapped service function.
     * @throws {Error} Throws a custom error if the wrapped function fails.
     */
    async handler(kwargs, fn) {   
        try {
            return await fn()
        }catch(error) {
            this.serviceError(kwargs, error)
        }

    }

    /**
     * Handles and re-throws specific service-layer errors with more context.
     * @param {Array<string>} kwargs - An array of strings used to create a more descriptive error message.
     * @param {Error} error - The original error object caught.
     * @throws {ValidationError} If the original error is a Sequelize ValidationError.
     * @throws {NotFoundError} If the original error is a NotFoundError.
     * @throws {Error} A generic error for any other type of error.
     */
    serviceError(kwargs, error) {
        console.error(error)
        // console.error(error)
        if(error instanceof ValidationError) { 
            throw new ValidationError(`Faile ${kwargs[0]} errors: ${error.message}`)
        }

        if(error instanceof NotFoundError) {
            throw new NotFoundError(`${kwargs[2]} with ID ${kwargs[1]} not found`)
        }

        throw new Error(`Error in: ${error.message}`)
    }
}


export default ServiceErrorHandler
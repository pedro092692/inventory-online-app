/**
 * This class represents an perzonalized error for not found resources 
 * Extends of the standar Error class
 * 
 * @class 
 * @extens Error 
 */
class NotFoundError extends Error {
    /**
     * Creates a new instance of NotFoundError.
     * @param {string} message - Message of the error.
     */
    constructor(message) {
        super(message)
        this.name = 'Not found error'
    }
}

export { NotFoundError }
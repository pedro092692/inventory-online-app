/**
 * This class represents an perzonalized error for invalid pin supervisor 
 * Extends of the standar Error class
 * 
 * @class 
 * @extens Error 
 */
class InvalidPinError extends Error {
    /**
     * Creates a new instance of InvalidPinError
     * @param {string} message - Message of the error.
     */
    constructor(message) {
        super(message)
        this.name = 'Invalid Pin Error'
    }
}

export { InvalidPinError }
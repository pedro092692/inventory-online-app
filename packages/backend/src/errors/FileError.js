/**
 * This class represents an perzonalized error for File related errors
 * Extends of the standar Error class
 * 
 * @class 
 * @extens Error 
 */
class FileError extends Error {
    /**
     * Creates a new instance of FileError.
     * @param {string} message - Message of the error.
     */
    constructor(message) {
        super(message)
        this.name = 'File error'
    }
}

class InvalidFileTypeError extends FileError {
    constructor(message) {
        super(message || 'Invalid file type only .xlsx, .xls and .csv are allowed')
        this.name = 'Invalid file type error'
    }
}

class EmptyRowsError extends FileError {
    constructor(message) {
        super(message || 'File contains empty rows')
        this.name = 'Empty rows error'
    }
}

export { FileError, InvalidFileTypeError, EmptyRowsError }
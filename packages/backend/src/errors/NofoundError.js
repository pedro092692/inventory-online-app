class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'Not found error'
    }
}

export { NotFoundError }
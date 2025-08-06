import express from 'express'


class SecurityRoutes {
    constructor() {
        this.router = express.Router()
        this.initializeRoutes()
    }

    /**
     * Initializes the security routes for login
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => res.send('Security Routes'))
    }
}

export default SecurityRoutes
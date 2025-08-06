import express from 'express'


class SecurityRoutes {
    constructor() {
        this.router = express.Router()
    }

    initializeRoutes() {
        this.router.get('/', (req, res) => res.send('Security Routes'))
    }
}

export default SecurityRoutes
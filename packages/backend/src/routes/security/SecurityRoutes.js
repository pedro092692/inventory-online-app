import express from 'express'
import SecurityController from '../../Controllers/admin/SecurityController.js'


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
        this.router.post('/login', (req, res) => new SecurityController().login(req, res))
        this.router.post('/verify-token', (req, res) => new SecurityController().verifyToken(req, res))
    }
}

export default SecurityRoutes
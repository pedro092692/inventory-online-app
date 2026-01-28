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
        this.router.get('/get-current-user', (req, res) => new SecurityController().getCurrentUser(req, res))
        this.router.post('/login', (req, res) => new SecurityController().login(req, res))
        this.router.post('/verify-token', (req, res) => new SecurityController().verifyToken(req, res))
        this.router.post('/isLogged', (req, res) => new SecurityController().isLogged(req, res))
    }
}

export default SecurityRoutes
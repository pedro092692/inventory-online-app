import { Router } from 'express';
import setPathToTestTenant from '../utils/setTestSchema.js';

class UserRoutes {
    constructor() {
        this.router = Router()
        this.router.use(setPathToTestTenant) // Middleware to set the schema for test tenant
        this.initializeRoutes()

    }

    initializeRoutes() {
        this.router.get("/", (req, res) => res.send("User Routes"))
    }
}

export default UserRoutes
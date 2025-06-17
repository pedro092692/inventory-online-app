import { Router } from "express"

class DollarValueRoutes{
    constructor() {
        this.router = Router()
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for the Dollar Value API.
     * @returns {void}
     */
    initializeRoutes() {    
        this.router.get("/", (req, res) => res.send("Dollar Value Routes"))
    }
}

export default DollarValueRoutes
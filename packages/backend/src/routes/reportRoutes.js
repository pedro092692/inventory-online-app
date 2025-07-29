import { Router } from "express"


class ReportRoutes {
    constructor() {
        this.router = Router()
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for the Product API.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => res.send("Report routes"))
    }
}

export default ReportRoutes


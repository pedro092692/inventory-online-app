import { Router } from "express"
import { Dollar } from "../models/inventory_models/DollarModel.js"
import DollarValueController from "../Controllers/DollarController.js"

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
        this.router.post("/", (req, res) => new DollarValueController(Dollar).createDollarValue(req, res))
    }
}

export default DollarValueRoutes
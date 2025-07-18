import { Router } from "express"
import SellerController from "../Controllers/SellerController.js"
import { Seller } from "../models/inventory_models/SellerModel.js"

class SellerRoutes{
    constructor() {
        this.router = Router()
        this.inicializateRoutes()
    }  
    /**
     * Initializes the routes for the Seller API.
     * @returns {void}
     */
    inicializateRoutes() {
        this.router.get("/", (req, res) => res.send("Seller routes"))
        this.router.get("/all", (req, res) => new SellerController(Seller).allSeller(req, res))
        this.router.get("/:id", (req, res) => new SellerController(Seller).getSeller(req, res))
        this.router.post("/", (req, res) => new SellerController(Seller).createSeller(req, res))
        this.router.patch("/:id", (req, res) => new SellerController(Seller).updateSeller(req, res))
        this.router.delete("/", (req, res) => new SellerController(Seller).deleteSeller(req, res))
    }
}

export default SellerRoutes 
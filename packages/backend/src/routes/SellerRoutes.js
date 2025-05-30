import { Router } from "express"
import SellerController from "../Controllers/SellerController.js"
import { Seller } from "../models/inventory_models/SellerModel.js"

class SellerRoutes{
    constructor() {
        this.router = Router()
        this.inicializateRoutes()
    }  
    
    inicializateRoutes() {
        this.router.get("/", (req, res) => res.send("Seller routes"))
        this.router.get("/all", (req, res) => new SellerController(Seller).allSeller(req, res))
    }
}

export default SellerRoutes 
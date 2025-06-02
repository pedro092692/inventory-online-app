import { Router } from "express"
import ProductController from "../Controllers/ProductController.js"
import {Product} from "../models/inventory_models/ProductModel.js"

class ProductRoutes {
    constructor(){
        this.router = Router()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get("/", (req, res) => res.send("Product routes"))
        this.router.get("/all", (req, res) => new ProductController(Product).allProducts(req, res))
    }
}

export default ProductRoutes
import { Router } from "express"
import {Invoice} from "../models/inventory_models/InvoiceModel.js"

class InvoiceRoutes {

    constructor() {
        this.router = Router()
        this.inicializateRoutes()
    }

    inicializateRoutes() {
        this.router.get("/", (req, res) => res.send("Invoices Routes"))
    }
}

export default InvoiceRoutes

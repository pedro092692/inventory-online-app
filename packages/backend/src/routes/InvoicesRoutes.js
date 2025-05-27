import { Router } from "express"
import InvoiceController from "../Controllers/InvoiceController.js"
import {Invoice} from "../models/inventory_models/InvoiceModel.js"

class InvoiceRoutes {

    constructor() {
        this.router = Router()
        this.inicializateRoutes()
    }

    inicializateRoutes() {
        this.router.get("/", (req, res) => res.send("Invoices Routes"))
        this.router.get('/all', (req, res) => new InvoiceController(Invoice).allInvoices(req, res))
    }
}

export default InvoiceRoutes

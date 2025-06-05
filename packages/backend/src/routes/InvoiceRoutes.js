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
        this.router.get("/all", (req, res) => new InvoiceController(Invoice).allInvoices(req, res))
        this.router.get("/day", (req, res) => new InvoiceController(Invoice).dayInvoices(req, res))
        this.router.get("/:id", (req, res) => new InvoiceController(Invoice).getInvoice(req, res))
        this.router.post("/", (req, res) => new InvoiceController(Invoice).createInvoice(req, res))
        this.router.patch("/:id", (req, res) => new InvoiceController(Invoice).updateInvoice(req, res))
    }   
}

export default InvoiceRoutes

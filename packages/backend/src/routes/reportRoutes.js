import { Router } from "express"
import ReportController from "../Controllers/reportController.js";
import { Invoice } from "../models/inventory_models/InvoiceModel.js";

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
        this.router.get("/", (req, res) => res.send("Report routes"))
        this.router.get("/top-spending-customers", (req, res) => new ReportController(Invoice).getTopSpendingCustomer(req, res))
        this.router.get("/top-recurring-customers", (req, res) => new ReportController(Invoice).getTopRecurringCustomer(req, res))
    }
}

export default ReportRoutes


import { Router } from "express"
import { PaymentDetail } from "../models/inventory_models/PaymentDetailModel.js"
import { Dollar } from "../models/inventory_models/DollarModel.js"
import PayInvoiceController from "../Controllers/PaymentInvoiceDetailController.js"

class PayInvoiceRoutes {

    constructor() {
        this.router = Router()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get("/", (req, res) => res.send("Pay Invoice Detail Route"))
        this.router.get("/:id", (req, res) => new PayInvoiceController(PaymentDetail).getPaymentDetail(req, res))
        this.router.post("/", (req, res) => new PayInvoiceController(PaymentDetail, Dollar).createPaymentInvoiceDetail(req, res))
        this.router.patch("/:id", (req, res) => new PayInvoiceController(PaymentDetail).updatePaymentDetail(req, res))
        this.router.delete("/", (req, res) => new PayInvoiceController(PaymentDetail).deletePaymentDetail(req, res))
    }
}

export default PayInvoiceRoutes
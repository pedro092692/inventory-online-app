import { Router } from "express"
import PaymentMethodController from "../Controllers/PaymentMethodController.js"
import { Payment } from "../models/inventory_models/PaymentModel.js"

class PaymentMethodRoutes { 
    
    constructor() {
        this.router = Router()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get("/", (req, res) => res.send("Payment Methods"))
        this.router.get("all", (req, res) => new PaymentMethodController(Payment).getAllProducts(req, res))
        this.router.get("/:id", (req, res) => new PaymentMethodController(Payment).getPaymentMethod(req, res))
        this.router.post("/", (req, res) => new PaymentMethodController(Payment).createPaymentMethod(req, res))
        this.router.patch("/:id", (req, res) => new PaymentMethodController(Payment).updatePaymentMethod(req, res))
        this.router.delete("/", (req, res) => new PaymentMethodController(Payment).deletePaymentMethod(req, res))
    }
}

export default PaymentMethodRoutes
import { Router } from "express"
import CustomerController from "../Controllers/CustomerController.js"
import {Customer} from "../models/inventory_models/CustomerModel.js"

class CustomerRoutes {
    constructor() {
        this.router = Router()
        this.initializeRoutes()

    }

    initializeRoutes() {
        this.router.get("/", (req, res) => res.send("Customers Routes"))
        this.router.get("/all", (req, res) => new CustomerController(Customer).allCustomers(req, res))
    }
}

export default CustomerRoutes

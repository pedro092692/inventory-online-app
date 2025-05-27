import { Router } from "express"
import setPathToTestTenant from "../utils/setTestSchema.js"
import CustomerController from "../Controllers/CustomerController.js"
import {Customer} from "../models/inventory_models/CustomerModel.js"

class UserRoutes {
    constructor() {
        this.router = Router()
        this.router.use(setPathToTestTenant) // Middleware to set the schema for test tenant
        this.initializeRoutes()

    }

    initializeRoutes() {
        this.router.get("/", (req, res) => res.send("Customers Routes"))
        this.router.get("/all", (req, res) => new CustomerController(Customer).allCustomers(req, res))
    }
}

export default UserRoutes

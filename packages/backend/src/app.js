import express from "express"
import Database from "./database/database.js"
import CustomerRoutes from "./routes/CustomerRoutes.js"
import InvoiceRoutes from "./routes/InvoicesRoutes.js"
import SellerRoutes from "./routes/SellerRoutes.js"

class Server {
    constructor(){
        this.app = express()
        this.port = 4000,
        this.db = new Database()
        //app middlewares
        this.middlewares()
        
        // app routes
        this.routes()

    }

    middlewares(){
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json())
    }

    routes(){
        this.app.get('/', (req, res) => res.send(`Hello world`))

        // customer routes
        this.app.use("/api/customers", new CustomerRoutes().router)

        // invoices routes
        this.app.use("/api/invoices", new InvoiceRoutes().router)

        // seller routes
        this.app.use("/api/sellers", new SellerRoutes().router)

        // this.app.get("/api/sellers", (req, res) => res.send("test"))
    }

    start(){
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://127.0.0.1:${this.port}`)
        })
    }
}

export default Server

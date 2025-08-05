import express from 'express'
import Database from './database/database.js'
import CustomerRoutes from './routes/CustomerRoutes.js'
import InvoiceRoutes from './routes/InvoiceRoutes.js'
import SellerRoutes from './routes/SellerRoutes.js'
import ProductRoutes from './routes/ProductRoutes.js'
import UserRoutes from './routes/admin/UserRoutes.js'
import RoleRoutes from './routes/admin/RoleRoutes.js'
import PaymentMethodRoutes from './routes/PaymentMethodRoutes.js'
import PayInvoiceRoutes from './routes/PaymentDetailRoutes.js'
import DollarValueRoutes from './routes/DollarValueRoutes.js'
import ReportRoutes from './routes/reportRoutes.js'

/**
 * @class Server
 * @description Main class to configure and start the Express server.
 */
class Server {
    /**
     * Initializes the Express app, database, middlewares, and routes.
     */
    constructor(){
        this.app = express()
        this.port = 4000,
        this.db = new Database()
        
        //app middlewares
        this.middlewares()
        
        // app routes
        this.routes()

    }

    /**
     * Configures application-level middlewares.
     * @returns {void}
     */
    middlewares(){
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json())
    }

    /**
     * Sets up all the API routes for the application.
     * @returns {void}
     */
    routes(){
        this.app.get('/', (req, res) => res.send('Hello world'))

        // customer routes
        this.app.use('/api/customers', new CustomerRoutes().router)

        // invoices routes
        this.app.use('/api/invoices', new InvoiceRoutes().router)

        // seller routes
        this.app.use('/api/sellers', new SellerRoutes().router)

        // product routes
        this.app.use('/api/products', new ProductRoutes().router)

        // users
        this.app.use('/api/users', new UserRoutes().router)

        // roles 
        this.app.use('/api/roles', new RoleRoutes().router)

        // payment methods
        this.app.use('/api/payment-methods', new PaymentMethodRoutes().router)

        // payment invoices 
        this.app.use('/api/pay-invoice', new PayInvoiceRoutes().router)

        // dollar value
        this.app.use('/api/dollar-value', new DollarValueRoutes().router)

        // report routes
        this.app.use('/api/reports', new ReportRoutes().router)
    }

    /**
     * Starts the server and listens on the configured port.
     * @returns {void}
     */
    start(){
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://127.0.0.1:${this.port}`)
        })
    }
}

export default Server

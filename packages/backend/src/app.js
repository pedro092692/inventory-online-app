import express from 'express'
import Database from './database/database.js'
import CustomerRoutes from './routes/CustomerRoutes.js'
import InvoiceRoutes from './routes/InvoiceRoutes.js'
import InvoiceDetailRoutes from './routes/invoiceDetailRoute.js'
import SellerRoutes from './routes/SellerRoutes.js'
import ProductRoutes from './routes/ProductRoutes.js'
import UserRoutes from './routes/admin/UserRoutes.js'
import RoleRoutes from './routes/admin/RoleRoutes.js'
import ExchangeRateRoutes from './routes/admin/ExchangeRateRoutes.js'
import PaymentMethodRoutes from './routes/PaymentMethodRoutes.js'
import PayInvoiceRoutes from './routes/PaymentDetailRoutes.js'
import DollarValueRoutes from './routes/DollarValueRoutes.js'
import ReportRoutes from './routes/reportRoutes.js'
import AuditLogRoutes from './routes/AuditLogRoutes.js'
import SecurityRoutes from './routes/security/SecurityRoutes.js'
import InvoiceReturnRoutes from './routes/invoiceReturnRoutes.js'
import StoreStatusRoutes from './routes/StoreStatusRoutes.js'
import StoreSettingsRoutes from './routes/StoreSettingsRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

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
        // Platforms like Fly.io/Render/Railway/Heroku assign the port at runtime and expect
        // the app to bind to it via process.env.PORT — falls back to 4000 for local dev.
        this.port = process.env.PORT || 4000
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
        this.app.use(cookieParser())
        // FRONTEND_URL must be set in production to the deployed frontend's real origin
        // (e.g. https://app.nexastock.com) — cookies-based auth needs an exact origin match,
        // "*" won't work with credentials:true. Falls back to localhost for local dev.
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://127.0.0.1:3000',
            credentials: true
        }))
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

        // invoice detail routes
        this.app.use('/api/invoice-details', new InvoiceDetailRoutes().router)

        // invoice return routes
        this.app.use('/api/invoice-returns', new InvoiceReturnRoutes().router)

        // seller routes
        this.app.use('/api/sellers', new SellerRoutes().router)

        // product routes
        this.app.use('/api/products', new ProductRoutes().router)

        // users
        this.app.use('/api/users', new UserRoutes().router)

        // roles
        this.app.use('/api/roles', new RoleRoutes().router)

        // platform exchange rate (admin-managed; drives subscription pricing in Bs)
        this.app.use('/api/exchange-rate', new ExchangeRateRoutes().router)

        // payment methods
        this.app.use('/api/payment-methods', new PaymentMethodRoutes().router)

        // payment invoices 
        this.app.use('/api/pay-invoice', new PayInvoiceRoutes().router)

        // dollar value
        this.app.use('/api/dollar-value', new DollarValueRoutes().router)

        // report routes
        this.app.use('/api/reports', new ReportRoutes().router)

        // audit log routes (payment cancellations, product returns, etc.)
        this.app.use('/api/audit-logs', new AuditLogRoutes().router)

        // security routes
        this.app.use('/api/security', new SecurityRoutes().router)

        // store status (active/blocked/expired) for the store's own users
        this.app.use('/api/store', new StoreStatusRoutes().router)

        // store settings (currently: the "tasa colchón" buffer rate for Cotizar/Etiquetas)
        this.app.use('/api/store-settings', new StoreSettingsRoutes().router)
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

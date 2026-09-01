import { Router } from 'express'
import SellerController from '../Controllers/SellerController.js'
import { authenticated, isOwner } from '../middlewares/authMiddleware.js'
import { validateFields } from '../validators/fieldValidator.js'

class SellerRoutes{
    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.router.use(this.setRoutesModels.bind(this))
        this.inicializateRoutes()
    }
    /**
     * Initializes the routes for the Seller API.
     *
     * `isOwner` is applied per-route rather than to the whole router: every
     * staff-management route needs it, but `/authorize` is the exception —
     * it's how a regular seller (who can't sell on credit) asks a
     * supervisor to unlock that with their PIN, so the requester is
     * deliberately NOT required to already be an owner/admin. Gating it
     * behind `isOwner` made the endpoint reject every request with
     * "Forbidden" before the PIN was ever checked, for correct and
     * incorrect PINs alike.
     * @returns {void}
     */
    inicializateRoutes() {
        this.router.get('/', (req, res) => res.send('Seller routes'))
        this.router.get('/all', isOwner, (req, res) => new SellerController(req.Seller).allSeller(req, res))
        this.router.get('/all-names', isOwner, (req, res) => new SellerController(req.Seller).sellersName(req, res))
        this.router.get('/total-invoices', isOwner, (req, res) => new SellerController(req.Seller, req.Invoice).getTotalSellerInvoices(req, res))
        this.router.get('/:id', isOwner, (req, res) => new SellerController(req.Seller).getSeller(req, res))
        this.router.post('/', isOwner, validateFields('createUser'), (req, res) => new SellerController(req.Seller).createSeller(req, res))
        this.router.post('/authorize', validateFields('authorizedSeller'), (req, res) => new SellerController(req.Seller).authorizedBySeller(req, res))
        this.router.patch('/:id', isOwner, (req, res) => new SellerController(req.Seller).updateSeller(req, res))
        this.router.delete('/', isOwner, (req, res) => new SellerController(req.Seller).deleteSeller(req, res))
    }
    /**
     * Middleware to attach the `Seller` model from the tenant-specific models to the request object.
     *
     * This method extracts the `Seller` model from `req.tenantModels` and assigns it to `req.Seller`.
     * If the model is missing, it responds with a 400 Bad Request.
     * Otherwise, it passes control to the next middleware.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    async setRoutesModels(req, res, next) {
        const {Seller, Invoice} = req.tenantModels
        if(!Seller || !Invoice) {
            return res.status(400).json({ message: 'Seller model is required or Incoive model is requiered' })
        }
        req.Seller = Seller
        req.Invoice = Invoice
        next()
    }
}

export default SellerRoutes

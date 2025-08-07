import { Router } from 'express'
import PaymentMethodController from '../Controllers/PaymentMethodController.js'
import { authenticated } from '../middlewares/authMiddleware.js'

class PaymentMethodRoutes { 
    
    constructor() {
        this.router = Router()
        this.router.use(authenticated)
        this.router.use(this.setRoutesModel.bind(this))
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for Payment Method API.
     * @returns {void} This method does not return a value.
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => res.send('Payment Methods'))
        this.router.get('/all', (req, res) => new PaymentMethodController(req.Payment).getAllProducts(req, res))
        this.router.get('/:id', (req, res) => new PaymentMethodController(req.Payment).getPaymentMethod(req, res))
        this.router.post('/', (req, res) => new PaymentMethodController(req.Payment).createPaymentMethod(req, res))
        this.router.patch('/:id', (req, res) => new PaymentMethodController(req.Payment).updatePaymentMethod(req, res))
        this.router.delete('/', (req, res) => new PaymentMethodController(req.Payment).deletePaymentMethod(req, res))
    }

    async setRoutesModel(req, res, next) {
        const { Payment } = req.tenantModels
        if(!Payment) {
            return res.status(400).json({ message: 'Payment model is required' })
        }
        req.Payment = Payment
        next()
    }
}

export default PaymentMethodRoutes
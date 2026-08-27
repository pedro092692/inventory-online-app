import { Router } from 'express'
import ExchangeRateController from '../../Controllers/admin/ExchangeRateController.js'
import { validateFields } from '../../validators/fieldValidator.js'
import { authenticated, isAdmin } from '../../middlewares/authMiddleware.js'

class ExchangeRateRoutes {
    constructor() {
        this.router = Router()
        this.router.use(authenticated, isAdmin)
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for the platform Exchange Rate API.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => new ExchangeRateController().getAllRates(req, res))
        // '/latest' must stay registered before '/:id' below — otherwise a GET to '/latest'
        // would be swallowed by '/:id' (id='latest'), same lesson as the payments routes.
        this.router.get('/latest', (req, res) => new ExchangeRateController().getLastRate(req, res))
        this.router.get('/:id', (req, res) => new ExchangeRateController().getRate(req, res))
        this.router.post('/', validateFields('setExchangeRate'), (req, res) => new ExchangeRateController().createRate(req, res))
        this.router.patch('/:id', validateFields('setExchangeRate'), (req, res) => new ExchangeRateController().updateRate(req, res))
        this.router.delete('/:id', (req, res) => new ExchangeRateController().deleteRate(req, res))
    }
}

export default ExchangeRateRoutes

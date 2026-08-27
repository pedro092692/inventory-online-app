import { Router } from 'express'
import UserController from '../../Controllers/admin/UserController.js'
import { validateFields } from '../../validators/fieldValidator.js'
import { authenticated, isAdmin } from '../../middlewares/authMiddleware.js'

class UserRoutes {
    constructor(){
        this.router = Router()
        this.router.use(authenticated, isAdmin)
        this.initializeRoutes()
    }

    /**
     * Initializes the routes for the User API.
     * @returns {void}
     */
    initializeRoutes() {
        this.router.get('/', (req, res) => res.send('User routes'))
        this.router.get('/all', (req, res) => new UserController().getAllUsers(req, res))
        this.router.get('/store-owners-all', (req, res) => new UserController().getAllStoreOwners(req, res))
        this.router.get('/search-owner', (req, res) => new UserController().searchStoreOwners(req, res))
        this.router.get('/total-pages', (req, res) => new UserController().totalPages(req, res))
        this.router.get('/store-owner/:id', (req, res) => new UserController().getStoreOwner(req, res))
        // NOTE: these /payments routes must stay registered before the generic '/:id' route
        // below — otherwise a GET to '/payments' would be swallowed by '/:id' (id='payments').
        this.router.get('/payments', (req, res) => new UserController().getPayments(req, res))
        this.router.get('/payments/:id/receipt-url', (req, res) => new UserController().getPaymentReceiptUrl(req, res))
        this.router.patch('/payments/:id/approve', (req, res) => new UserController().approvePayment(req, res))
        this.router.patch('/payments/:id/reject', validateFields('rejectPayment'), (req, res) => new UserController().rejectPayment(req, res))
        this.router.patch('/payments/:id/revert', (req, res) => new UserController().revertPayment(req, res))
        this.router.get('/:id', (req, res) => new UserController().getUser(req, res))
        this.router.post('/', (req, res) => new UserController().createUser(req, res))
        this.router.post('/store', validateFields('createStore'), (req, res) => new UserController().createNewStore(req, res))
        this.router.patch('/', (req, res) => new UserController().updateUser(req, res))
        this.router.patch('/storeOwner/:id', validateFields('updateStoreOwner'), (req, res) => new UserController().updateStoreOwner(req, res))
        this.router.patch('/store/:tenantId/block', validateFields('blockStore'), (req, res) => new UserController().blockStore(req, res))
        this.router.patch('/store/:tenantId/unblock', (req, res) => new UserController().unblockStore(req, res))
        this.router.delete('/', (req, res) => new UserController().deleteUser(req, res))
    }
}

export default UserRoutes
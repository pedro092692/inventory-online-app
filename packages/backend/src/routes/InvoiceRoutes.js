import { Router } from 'express'
import InvoiceController from '../Controllers/InvoiceController.js'
import {Invoice} from '../models/inventory_models/InvoiceModel.js'
import {Product} from '../models/inventory_models/ProductModel.js'
import {Dollar} from '../models/inventory_models/DollarModel.js'
import {InvoiceDetail} from '../models/inventory_models/InvoiceDetailModel.js'

class InvoiceRoutes {

    constructor() {
        this.router = Router()
        this.inicializateRoutes()
    }
    /**
     * Initializes the routes for the Invoice API.
     * @returns {void}
     */
    inicializateRoutes() {
        this.router.get('/', (req, res) => res.send('Invoices Routes'))
        this.router.get('/all', (req, res) => new InvoiceController(Invoice).allInvoices(req, res))
        this.router.get('/day', (req, res) => new InvoiceController(Invoice).dayInvoices(req, res))
        this.router.get('/:id', (req, res) => new InvoiceController(Invoice, null, null, Dollar).getInvoice(req, res))
        this.router.get('/send-whatsapp/:id', (req, res) => new InvoiceController(Invoice, null, null, Dollar).sendWhatsappInvoice(req, res))
        this.router.post('/', (req, res) => new InvoiceController(Invoice, InvoiceDetail, Product, Dollar).createInvoice(req, res))
        this.router.patch('/:id', (req, res) => new InvoiceController(Invoice, InvoiceDetail, Product, Dollar).updateInvoice(req, res))
        this.router.delete('/', (req, res) => new InvoiceController(Invoice, InvoiceDetail, Product, Dollar).deleteInvoice(req, res))
        this.router.delete('/detail', (req, res) => new InvoiceController(Invoice, InvoiceDetail, Product, Dollar).deleteInvoiceDetail(req, res))
    }   
}

export default InvoiceRoutes

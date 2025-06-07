import ControllerErrorHandler from "../errors/controllerErrorHandler.js"
import calculeTotalInvoice from "../utils/calculeTotal.js"
import InvoiceService from "../services/InvoiceService.js"

class InvoiceController {
    // error controller new instace 
    #error = new ControllerErrorHandler()
    constructor(model, detailModel=null) {
        this.invoiceService = new InvoiceService(model, detailModel)
        this.#error
    }

    createInvoice = this.#error.handler( async(req, res) => {
        const {customer_id, seller_id } = req.body
        const details = req.body.details
        
        const newInvoice = await this.invoiceService.createInvoice(customer_id, seller_id)
        
        if(!details) {
            throw new Error('Details is required')
        }
        
        // add invoice_id to details 
        for(const detail of details) {
            detail["invoice_id"] = newInvoice.id
        }

        // create invoice details
        await this.invoiceService.addInvoiceDetails(details)

        // update total value 
        const total = calculeTotalInvoice(details)

        const updatedInvoice = await this.invoiceService.updateInvoice(newInvoice.id, { total: total})

        res.status(201).json(updatedInvoice)
    })

    allInvoices = this.#error.handler( async(req, res) => {
        const invoices = await this.invoiceService.getAllInvoices()
        res.status(200).json(invoices)
    })
    

    dayInvoices = this.#error.handler( async(req, res) => {
        const dayInvoices = await this.invoiceService.getDayInvoices()
        res.status(200).json(dayInvoices)
    })

    getInvoice = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const invoice = await this.invoiceService.getInvoice(id)
        res.status(200).json(invoice)
    })

    updateInvoice = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const updates = req.body
        const updatedInvoice = await this.invoiceService.updateInvoice(id, updates)
        res.status(200).json(updatedInvoice)
    })

    deleteInvoice = this.#error.handler( async(req, res) => {
        const invoiceId = req.body.invoiceId
        // delete invoice 
        await this.invoiceService.deleteInvoice(invoiceId)
        res.status(204).json({})
    })
    
}

export default InvoiceController

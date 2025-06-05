import ControllerErrorHandler from "../errors/controllerErrorHandler.js";
import InvoiceService from "../services/InvoiceService.js";

class InvoiceController {
    // error controller new instace 
    #error = new ControllerErrorHandler()
    constructor(model) {
        this.invoiceService = new InvoiceService(model)
        this.#error
    }

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

    
}

export default InvoiceController

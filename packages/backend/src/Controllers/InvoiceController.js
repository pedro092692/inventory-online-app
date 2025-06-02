import InvoiceService from "../services/InvoiceService.js";

class InvoiceController {
    constructor(model) {
        this.invoiceService = new InvoiceService(model)
    }

    async allInvoices(req, res) {
        try{
            const invoices = await this.invoiceService.getAllInvoices()
            res.status(200).json(invoices)
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }

    async dayInvoices(req, res) {
        try {
            const dayInvoices = await this.invoiceService.getDayInvoices()
            res.status(200).json(dayInvoices)
        }catch(error){
            res.status(500).json({ message: error.message })
        }
    }
}

export default InvoiceController

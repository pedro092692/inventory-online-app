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
}

export default InvoiceController

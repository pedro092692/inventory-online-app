class InvoiceService {
    constructor(model) {
        this.Invoice = model;
    }

    async getAllInvoices() {
        try{
            return await this.Invoice.findAll({
                include: {
                    association: "customer", attributes: ["name", "phone"]
                },
                limit: 10,
                offset: 0,
            })
        }catch(error) {
            throw new Error(`Error fetching customers: ${error.message}`)
        }
    }
}

export default InvoiceService
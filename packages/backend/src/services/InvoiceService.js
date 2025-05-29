class InvoiceService {
    constructor(model) {
        this.Invoice = model;
    }

    async getAllInvoices() {
        try{
            return await this.Invoice.findAll({
                include: [
                    {
                        association: "customer", attributes: ["name", "phone"],
                    },
                    {
                        association: "products",
                        attributes: ["name"],
                        through: {
                            attributes: ["quantity", "unit_price"] 
                        }
                    },
                    {
                        association: "seller", attributes: ["name"]
                    }
                ],

                limit: 10,
                offset: 0,
            })
        }catch(error) {
            throw new Error(`Error fetching Invoices: ${error.message}`)
        }
    }
}

export default InvoiceService
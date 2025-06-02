import { Op } from "sequelize"

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
                order: [["id", "DESC"]],
                limit: 10,
                offset: 0,
            })
        }catch(error) {
            throw new Error(`Error fetching Invoices: ${error.message}`)
        }
    }

    async getDayInvoices() {
        try {
            // set today and tomorrow
            const today = new Date()
            today.setHours(0, 0, 0)

            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            const totalSelled = await this.Invoice.sum("total", {
                where: {
                    date: {
                        [Op.gte]: today,
                        [Op.lt]: tomorrow
                    }
                }
            })

            const todayInvoices = await this.Invoice.findAll({
                where: {
                    date: {
                        [Op.gte]: today,
                        [Op.lt]: tomorrow
                    }
                },
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
                order: [["id", "DESC"]],
                limit: 10,
                offset: 0,
            })

            return {totalSelled, todayInvoices}


        }catch(error) {
            throw new Error(`Error feching Invoices: ${error.message}`)
        }
    }
}

export default InvoiceService
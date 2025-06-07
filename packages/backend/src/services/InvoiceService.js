import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import InvoiceDetailService from "./InvoiceDestailService.js"
import calculeTotalInvoice from "../utils/calculeTotal.js"
import { NotFoundError } from "../errors/NofoundError.js"
import { Op } from "sequelize"

class InvoiceService {
    
    // instance of error handler 
    #error = new ServiceErrorHandler()

    constructor(model, detailModel=null) {
        this.Invoice = model
        this.InvoiceDetail = new InvoiceDetailService(detailModel)
        this.#error
    }

    createInvoice(customer_id, seller_id) {
        return this.#error.handler(["Create Invoice"], async() => {
            const newInvoice = await this.Invoice.create({
                date: new Date(),
                customer_id: customer_id, 
                seller_id: seller_id, 
                total: 0
            })
            return newInvoice
        })
    }

    addInvoiceDetails(details) {
        return this.#error.handler(["Add invoices details"], async() => {
            const newDetails = await this.InvoiceDetail.createInvoiceDetail(details)
            return newDetails
        })
    }

    getAllInvoices(limit=10, offset=0) {
        return this.#error.handler(["Read All invoices"], async () => {
            const invoices = await this.Invoice.findAll({
                include: [
                    {
                        association: "customer", attributes: ["name", "phone"]
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
                limit: limit,
                offset: offset,
            })
            return invoices
        })
    }

    getDayInvoices() {
        return this.#error.handler("Read Day Invoices", async () => {
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

            if(totalSelled == null) {
                return "No invoices for today."
            }

            return { totalSelled, todayInvoices }
        })
    }

    getInvoice(id) {
        return this.#error.handler(["Read Invoice", id, "Invoice"], async() => {
            const invoice = await this.Invoice.findByPk(id, {
                include: [
                    {
                        association: "customer", attributes: ["name", "phone"]
                    },
                    {
                        association: "products",
                        attributes: ["name"],
                        through: {
                            attributes: ["id", "quantity", "unit_price"] 
                        }
                    },
                    {
                        association: "seller", attributes: ["name"]
                    }
                ],
            })
            if(!invoice) {
                throw new NotFoundError()
            }
            return invoice
        })
    }

    updateInvoice(invoiceId, updates) {
        return this.#error.handler(["Update Invoice", invoiceId, "Invoice"], async() => {
            const invoice = await this.getInvoice(invoiceId)
            let { customer_id, seller_id, total } = updates
            // if data have details update invoice details
            if(updates.details) {
                // add invoice id to details
                for(const detail of updates.details) {
                    detail["invoice_id"] = invoiceId
                }
                // update invoice details
                await this.InvoiceDetail.updateInvoiceDetail(updates.details)
                
                // update total value 
                total = calculeTotalInvoice(updates.details)
            }
            const updatedInvoice = await invoice.update({customer_id, seller_id, total})
            return updatedInvoice
        })
    }

    deleteInvoice(invoiceId) {
        return this.#error.handler(["Delete Invoice", invoiceId, "Invoice"], async() => {
            const invoice = await this.getInvoice(invoiceId)
            // delete invoice 
            await invoice.destroy()
            return 1
        })
    }
}

export default InvoiceService
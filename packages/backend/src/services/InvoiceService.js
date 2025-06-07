import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import InvoiceDetailService from "./InvoiceDestailService.js"
import ProductService from "./ProductService.js"
import calculeTotalInvoice from "../utils/calculeTotal.js"
import { NotFoundError } from "../errors/NofoundError.js"
import { Op } from "sequelize"

class InvoiceService {
    
    // instance of error handler 
    #error = new ServiceErrorHandler()

    constructor(model, detailModel=null, productModel=null) {
        this.Invoice = model
        this.InvoiceDetail = new InvoiceDetailService(detailModel)
        this.Product = new ProductService(productModel)
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
            // check for product stock
            const produtscStock = await this.Product.getProductStock(details)
            
            // validate stock for each product
            this.validateStockProduct(produtscStock, details)

            // subtract stock from products table
            await this.Product.updateStock(details)
            
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
            let invoice = await this.getInvoice(invoiceId)
            let { customer_id, seller_id, total } = updates
            // if data have details update invoice details
            if(updates.details) {
                // add invoice id to details
                for(const detail of updates.details) {
                    detail["invoice_id"] = invoiceId

                    // actual detail
                    if(detail.id){
                        const actualDetail = await this.InvoiceDetail.getInvoiceDetail(detail.id)

                        // get product 
                        const product = await this.Product.getProduct(actualDetail.product_id)

                        // defference 
                        const originalStock = product.stock + actualDetail.quantity
                        if(detail.quantity <= originalStock) {
                            // restore stock
                            await this.Product.restoreStock(actualDetail.product_id, actualDetail.quantity)
                            // update stock 
                            await this.Product.updateProduct(actualDetail.product_id, { stock: originalStock - detail.quantity})
                        }else{
                            throw new Error('No enought stock for this quantity')
                        }
                        
                        
                    }
                    
                }

                // check for product stock
                // const produtscStock = await this.Product.getProductStock(updates.details)
            
                // validate stock for each product
                // this.validateStockProduct(produtscStock, updates.details)

                // subtract stock from products table
                // await this.Product.updateStock(updates.details)

                // update invoice details
                await this.InvoiceDetail.updateInvoiceDetail(updates.details)
                
                // update total value 
                total = calculeTotalInvoice(updates.details)

                // update invoice with new products:
                invoice = await this.getInvoice(invoiceId)
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

    validateStockProduct(produtscStock, details) {
    // validate stock for each product
        for(const detail of details) {
            const product = produtscStock.find(p => p.id === detail.product_id)
            if(!product || product.stock < detail.quantity) {
                throw new Error(`Not enougth stock for this product: ${product.id}, Avaliale stock: ${product.stock}`)
            }
        }
    }
}

export default InvoiceService
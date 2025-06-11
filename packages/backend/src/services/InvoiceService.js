import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import InvoiceDetailService from "./InvoiceDestailService.js"
import ProductService from "./ProductService.js"
import { NotFoundError } from "../errors/NofoundError.js"
import verifyDetails from "../utils/VerifiyDetails.js"
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
        /*
            this funcion create a new invoice
            @param {number} customer_id - id of the customer
            @param {number} seller_id - id of the seller 
            @returns {Object} - new invoice created   
        */ 
        return this.#error.handler(["Create Invoice"], async() => {
            // create new invoice
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
        /*
            This function add details to invoice
            @param {Array} details - array of details to add to invoice
            @returns {Array} - array of new details created
        */
        return this.#error.handler(["Add invoices details"], async() => {
            // verify details if details is empty or not an array throw error
            verifyDetails(details)

            // check for product stock
            const produtscStock = await this.Product.getProductStock(details)
            
            // validate stock for each product
            this.validateStockProduct(produtscStock, details)

            // subtract stock from products table
            await this.Product.updateStock(details)
            
            // add invoice id to details
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
                order: [["products", "name", "ASC"]]
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
                 // verify details
                verifyDetails(updates.details, true)

                // add invoice id to details
                for(const detail of updates.details) {
                    detail["invoice_id"] = invoiceId

                    // actual detail
                    if(detail.id) {
                        const actualDetail = await this.InvoiceDetail.getInvoiceDetail(detail.id)

                        // get product 
                        const product = await this.Product.getProduct(actualDetail.product_id)

                        // difference between actual detail and new detail
                        const originalStock = product.stock + actualDetail.quantity
                        if(detail.quantity <= originalStock) {
                            // restore stock
                            await this.Product.restoreStock(actualDetail.product_id, actualDetail.quantity)
                            // update stock 
                            await this.Product.updateProduct(actualDetail.product_id, { stock: originalStock - detail.quantity})
                        }else{
                            throw new Error('No enought stock for this quantity')
                        }
                               
                    }else {
                        // check if product already exist in details
                        const invoiceDetails = await this.InvoiceDetail.getDetailByInvoiceId(invoiceId)
                        let productsId = invoiceDetails.map(detail => detail.product_id)
                    
                        if(productsId.includes(detail.product_id)) {
                            throw new Error(`Product with id ${detail.product_id} already exists in invoice details add id to details.`)
                            
                        }
    
                        // if detail is new, check for product stock
                        const product = await this.Product.getProduct(detail.product_id)
                        if(!product) {
                            throw new NotFoundError(`Product with id ${detail.product_id} not found`)
                        }
                        
                        // validate stock
                        if(detail.quantity > product.stock) {
                            throw new Error(`Not enought stock for this product: ${product.id}, Avaliale stock: ${product.stock}`)
                        }
                        
                        // subtract stock from products table
                        await this.Product.updateProduct(product.id, { stock: product.stock - detail.quantity })
                    }                 
                }

                // update invoice details
                await this.InvoiceDetail.updateInvoiceDetail(updates.details)
                
                // update total value 
                // update invoice with new products:
                invoice = await this.getInvoice(invoiceId)

                // caculete total
                total = this.calculeTotalFromInvoice(invoice.products)
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

    deleteInvoiceDetails(ids) {
        return this.#error.handler(["Delete Detail", ids, "Detail"], async() => {
            // get details
            const details = await this.InvoiceDetail.getInvoiceDetails(ids)
            if(!details || details.length === 0) {
                throw new NotFoundError()
            }
            
             // restore stock for each product
            for(const detail of details) {
                const product = await this.Product.getProduct(detail.product_id)
                if(!product) {
                    throw new NotFoundError(`Product with id ${detail.product_id} not found`)
                }
                // restore stock
                await this.Product.restoreStock(detail.product_id, detail.quantity)
            }

            // delete details
            await this.InvoiceDetail.deleteInvoiceDetail(ids)

            // update invoice total
            const invoice = await this.getInvoice(details[0].invoice_id)
            
            // calculate new total 
            const newTotal = invoice.products.map( product => {
                const quantity = product.invoice_details.dataValues.quantity
                const unitPrice = product.invoice_details.dataValues.unit_price
                return quantity * unitPrice
            })

            // update invoice with new total
            await this.updateInvoice(invoice.id, { total: newTotal.reduce(( sum, acc) => sum + acc, 0) })
            return 1
        }) 
    }
    
    // utils

    validateStockProduct(produtscStock, details) {
    // validate stock for each product
        for(const detail of details) {
            const product = produtscStock.find(p => p.id === detail.product_id)
            if(!product || product.stock < detail.quantity) {
                throw new Error(`Not enougth stock for this product: ${product.id}, Avaliale stock: ${product.stock}`)
            }
        }
    }

    calculeTotalFromInvoice(object) {
        const total = object.map( product => {
            const quantity = product.invoice_details.dataValues.quantity
            const unitPrice = product.invoice_details.dataValues.unit_price
            return quantity * unitPrice
        })
        return total.reduce(( sum, acc) => sum + acc, 0)
    }
}

export default InvoiceService
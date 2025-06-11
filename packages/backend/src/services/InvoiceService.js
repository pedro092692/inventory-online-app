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
        /*
            This function get all invoice with details 
            @param {number} limit - number of invoices to return
            @param {number} offset - number of invoices to skip 
            @returns {Array} - array of invoices with details
        */
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
        /*
            This function get all invoice of today
            @returns {Object} - object with total selled and today invoices
        */
        return this.#error.handler("Read Day Invoices", async () => {
            // set today date to 00:00:00
            const today = new Date()
            today.setHours(0, 0, 0)

            // set tomorrow date to 00:00:00
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            
            // create query to get total selled today
            const totalSelled = await this.Invoice.sum("total", {
                where: {
                    date: {
                        [Op.gte]: today,
                        [Op.lt]: tomorrow
                    }
                }
            })
            // create query to get all invoices of today

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

            // if no invoices found return message

            if(totalSelled == null) {
                return "No invoices for today."
            }

            return { totalSelled, todayInvoices }
        })
    }

    getInvoice(id) {
        /* 
            This function get an invoice by id
            @param {number} id - id of the invoice
            @returns {Object} - invoice with details, customer and seller
            @throws {NotFoundError} - if invoice not found
        */
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

            // if invoice not found throw not found error
            if(!invoice) {
                throw new NotFoundError()
            }

            return invoice
        })
    }

    /**
     * Updates an invoice by its ID with new customer, seller, total, or details.
     * @param {number} invoiceId 
     * @param {Object} updates 
     * @returns {Promise<Object>}
     */
    updateInvoice(invoiceId, updates) {
        return this.#error.handler(["Update Invoice", invoiceId, "Invoice"], async() => {
            const invoice = await this.getInvoice(invoiceId)
            const { customer_id, seller_id, total, details } = updates

            if (!customer_id && !seller_id && !total && !details) {
                throw new Error("At least one of these customer_id, seller_id, total or details must be defined")
            }

            if(details) {
                await this._validateAndUpdateDetails(invoiceId, details)
                updates.total = await this._recalculateTotal(invoiceId)
            }

            await invoice.update({
                customer_id: customer_id,
                seller_id: seller_id,
                total: updates.total || invoice.total
            })

            const newInvoice = await this.getInvoice(invoiceId)
            
            return newInvoice
        })
    }

    async _validateAndUpdateDetails(invoiceId, details) {
        
        verifyDetails(details)

        for(const detail of details) {
            detail["invoice_id"] = invoiceId

            if(detail.id) {
                // handle existing detail
                await this._handleExistingDetail(detail)
            }else {
                // handle new detail
                await this._handleNewDetail(invoiceId, detail)
            }
        }

        await this.InvoiceDetail.updateInvoiceDetail(details)
    } 

    async _handleExistingDetail(detail) {
        const actualDetail = await this.InvoiceDetail.getInvoiceDetail(detail.id)
        if(!actualDetail) {
            throw new Error(`Detail with id ${detail.id} not found`)
        }

        const product = await this.Product.getProduct(actualDetail.product_id)
        const originalStock = product.stock + actualDetail.quantity

        if(detail.quantity > originalStock) {
            throw new Error('No enought stock for this quantity')
        }

        await this.Product.restoreStock(actualDetail.product_id, actualDetail.quantity)
        await this.Product.updateProduct(actualDetail.product_id, { stock: originalStock - detail.quantity }

        )
    }

    async _handleNewDetail(invoiceId, detail) {
        
        const invoiceDetails = await this.InvoiceDetail.getDetailByInvoiceId(invoiceId)
        const productsId = invoiceDetails.map(detail => detail.product_id)

        if(productsId.includes(detail.product_id))  {
            throw new Error(`Product with id ${detail.product_id} already exists in invoice details add id to details.`)
        }

        const product = await this.Product.getProduct(detail.product_id)
        
        if(detail.quantity > product.stock) {
            throw new Error(`Not enought stock for this product: ${product.id}, Avaliale stock: ${product.stock}`)
        }

        await this.Product.updateProduct(product.id, { stock: product.stock - detail.quantity })
    }

    async _recalculateTotal(invoiceId) {
        const invoice = await this.getInvoice(invoiceId)
        return this.calculeTotalFromInvoice(invoice.products)
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
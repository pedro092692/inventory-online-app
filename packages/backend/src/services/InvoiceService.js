import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import InvoiceDetailService from "./InvoiceDestailService.js"
import ProductService from "./ProductService.js"
import DollarValueService from "./DollarValueService.js"
import { NotFoundError } from "../errors/NofoundError.js"
import verifyDetails from "../utils/VerifiyDetails.js"
import { Op } from "sequelize"

class InvoiceService {
    
    // instance of error handler 
    #error = new ServiceErrorHandler()

    constructor(model, detailModel=null, productModel=null, dollarModel=null) {
        this.Invoice = model
        this.InvoiceDetail = new InvoiceDetailService(detailModel)
        this.Product = new ProductService(productModel, dollarModel)
        this.dollarValue = new DollarValueService(dollarModel)
        this.#error
    }

    /**
    * Create a new invoice (without details)
    * @param {number} customer_id - id of the customer
    * @param {number} seller_id - id of the seller 
    * @returns {Object} - new invoice created   
    */  
    createInvoice(customer_id, seller_id, details) {
        return this.#error.handler(["Create Invoice"], async() => {
            // get dollar value 
            const dollar_value = await this.dollarValue.getLastValue()
            // check is dollar value is declared.
            if(!dollar_value) {
                throw new Error('A valid dollar value is required please update dollar value.')
            }
            
            // verify details if details is empty or not an array throw error
            verifyDetails(details)
            
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

    /**
    * Add details to invoice (create new details, subtract stock from products)
    * @param {Array} details - array of details to add to invoice
    * @returns {Array} - array of new details created
    */
    addInvoiceDetails(details) {
        return this.#error.handler(["Add invoices details"], async() => {
            // verify details if details is empty or not an array throw error
            verifyDetails(details)

            // check for product stock
            const produtscStock = await this.Product.getProductStock(details)
            
            // get product unit price 
            const productsUnitPrice = await this.Product.getProductUnitPrice(details)
            
            // add unit price to details
            details.map(detail => {
                const product = productsUnitPrice.find(product => product.id === detail.product_id) 
                // throw error if product not found
                if(!product) {
                    // delete invoice and throw error
                    this.deleteInvoice(details[0].invoice_id)
                    throw new Error(`Product with id ${detail.product_id} not found`)
                }
                detail.unit_price = product.selling_price
            })

            
            // validate stock for each product
            this.validateStockProduct(produtscStock, details)

            // subtract stock from products table
            await this.Product.updateStock(details)
            
            // add invoice id to details
            const newDetails = await this.InvoiceDetail.createInvoiceDetail(details)
            
            return newDetails
        })
    }

    /**
    * Get all invoice with details: seller, customer and products 
    * @param {number} limit - number of invoices to return
    * @param {number} offset - number of invoices to skip 
    * @returns {Array} - array of invoices with details
    */
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

    /**
    * Get all invoices of today with total selled, a message if no invoices found
    * @returns {Object} - object with total selled and today invoices
    */
    getDayInvoices() {
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
                    },
                    status: "paid"
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

    /**
    * Get an invoice by id
    * @param {number} id - id of the invoice
    * @returns {Object} - invoice with details, customer and seller
    * @throws {NotFoundError} - if invoice not found
    */
    getInvoice(id, referenceProduct=true) {
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
                    },
                    {
                        association: "payments-details",
                        include: [
                            {
                                association: "payments",
                                attributes: ["name", "currency"],
                            },
                            
                        ],
                        attributes: ["amount", "reference_amount"]
                    }
                ],
                order: [["products", "name", "ASC"]]
            })

            // if invoice not found throw not found error
            if(!invoice) {
                throw new NotFoundError()
            }

            if(referenceProduct){
                // check if invoice is paid 
                if(invoice.status === "unpaid") {
                    // calculate refrence amount 
                    const dollarValue = await this.dollarValue.getLastValue()
                    invoice.total_reference = (invoice.total * dollarValue.value).toFixed(2)

                    // changed product price to reference price 
                    invoice.products = this._calculeBolivarPriceProducts(invoice.products, dollarValue)

                    // add total paid in boilvar to invoice
                    invoice.dataValues.total_Paid_Bolivar = (invoice.total_paid * dollarValue.value).toFixed(2)

                    // add total to pay in dollar
                    invoice.dataValues.total_to_pay_dollar = (invoice.total - invoice.total_paid).toFixed(2)
                    

                }else {
                    // get reference value
                    const dollarValue = (parseFloat(invoice.total_reference) / parseFloat(invoice.total)).toFixed(2)
                    // changed product price to reference price 
                    invoice.products = this._calculeBolivarPriceProducts(invoice.products, { value: dollarValue })
                    
                    // add total paid in boilvar to invoice
                    invoice.dataValues.total_Paid_Bolivar = invoice.total_reference
                }   
            }
            

            return invoice
        })
    }

    /**     * Get a simple invoice by its ID, without details.
     * @param {number} id - The ID of the invoice to retrieve.
     * * @returns {Promise<Object>} - Returns a promise that resolves to the invoice object.
     * @throws {NotFoundError} - Throws an error if the invoice is not found.
     **/
    getSimpleInvoice(id) {
        return this.#error.handler(["Read Invoice", id, "Invoice"], async() => {
            const invoice = await this.Invoice.findByPk(id)
            
            if(!invoice) {
                throw new Error(`Invoice with id ${id} not found`)
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
            const invoice = await this.getSimpleInvoice(invoiceId)

            const { customer_id, seller_id, total, total_reference, total_paid, details, status } = updates


            if (!customer_id && !seller_id && !total && !details && !total_reference && !total_paid && !status) {
                throw new Error("At least one of these customer_id, seller_id, total, total_paid, total_reference, details or status must be defined")
            }

            if(details) {
                await this._validateAndUpdateDetails(invoiceId, details)
                updates.total = await this._recalculateTotal(invoiceId)
            }

            await invoice.update({
                customer_id: customer_id,
                seller_id: seller_id,
                total: updates.total || invoice.total,
                total_reference: total_reference || invoice.total_reference,
                total_paid: total_paid || invoice.total_paid,
                status: status || invoice.status
            })

            const newInvoice = await this.getInvoice(invoiceId)
            
            return newInvoice
        })
    }

    /**
     * Validates and updates invoice details, handling both existing and new details.
     * @param {number} invoiceId - ID of the invoice to update details for.
     * @param {Array} details - Array of detail objects to validate and update.
     * @throws {Error} - Throws an error if validation fails or if stock is insufficient.
     * @returns {Promise<void>} - Returns a promise that resolves when the details are successfully validated and updated.
     */
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

    /**
     * Handles the update of an existing invoice detail, restoring stock and updating product stock.
     * @param {Object} detail - The detail object containing the id and quantity to update.
     * @throws {Error} - Throws an error if the detail is not found or if there is insufficient stock.
     *  * @returns {Promise<void>} - Returns a promise that resolves when the detail is successfully handled.
     */
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

    /**
     * Handles the addition of a new invoice detail, checking for existing products and sufficient stock.
     * @param {number} invoiceId - The ID of the invoice to which the detail is being added.
     * @param {Object} detail - The detail object containing product_id and quantity.
     * @throws {Error} - Throws an error if the product already exists in the invoice details or if there is insufficient stock.
     * @return {Promise<void>} - Returns a promise that resolves when the detail is successfully handled.
     */
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

    /**
     * Recalculates the total of an invoice based on its products.
     * @param {number} invoiceId - The ID of the invoice to recalculate.
     * @returns {Promise<number>} - Returns a promise that resolves to the recalculated total.
     * @throws {NotFoundError} - Throws an error if the invoice is not found.
     * 
     */
    async _recalculateTotal(invoiceId) {
        const invoice = await this.getInvoice(invoiceId, false)
        return this.calculeTotalFromInvoice(invoice.products)
    }
    
    /**
     * Deletes an invoice by its ID
     * @param {number} invoiceId - The ID of the invoice to delete.
     * @returns {Promise<number>} - Returns a promise that resolves to 1 if the invoice is successfully deleted.
     * @throws {NotFoundError} - Throws an error if the invoice is not found.
     */
    deleteInvoice(invoiceId) {
        return this.#error.handler(["Delete Invoice", invoiceId, "Invoice"], async() => {
            const invoice = await this.getInvoice(invoiceId, false)
            
            // gets invoices details ids 
            const product_details = invoice.products.map((product => product.invoice_details.id))
            const details = await this.InvoiceDetail.getInvoiceDetails(product_details)
            
            //restore product stock
            await this._restoreStockProduct(details)
            
            // delete details 
            await this.InvoiceDetail.deleteInvoiceDetail(product_details)

            // delete invoice 
            await invoice.destroy()
            return 1
        })
    }

    /**
     * Deletes invoice details by their IDs, restores stock for each product, and updates the invoice total.
     * @param {Array} ids - Array of detail IDs to delete.
     * @returns {Promise<number>} - Returns a promise that resolves to 1 if the details are successfully deleted.
     * @throws {NotFoundError} - Throws an error if no details are found for the provided IDs.
     * @throws {Error} - Throws an error if a product is not found while restoring stock.
     */
    deleteInvoiceDetails(ids) {
        return this.#error.handler(["Delete Detail", ids, "Detail"], async() => {
            // get details
            const details = await this.InvoiceDetail.getInvoiceDetails(ids)
            if(!details || details.length === 0) {
                throw new NotFoundError()
            }
            
             // restore stock for each product
            await this._restoreStockProduct(details)

            // delete details
            await this.InvoiceDetail.deleteInvoiceDetail(ids)


            // update invoice total
            const invoice = await this.getInvoice(details[0].invoice_id, false)
            
            // calculate new total 
            const newTotal = this.calculeTotalFromInvoice(invoice.products)           

            // update invoice with new total
            
            await invoice.update({
                total: newTotal
            })
            return 1
        }) 
    }

    /**
     * Restore product stock when it is delete of invoice details
     * @param {Array} details - Array of objects with product_id and quantity keys
     * @param {Number} detatil
     * @returns {Promise<number>} - Return a promise that resolve 1 if invoice details are deleted
     * @throws {Error} Throws an error if cannot delete invoice details.
     */
    async _restoreStockProduct(details) {
        for(const detail of details) {
            const product = await this.Product.getProduct(detail.product_id)
            if(!product) {
                throw new NotFoundError(`Product with id ${detail.product_id} not found`)
            }
            // restore stock
            await this.Product.restoreStock(detail.product_id, detail.quantity) 
        }
        return 1
    }
    
    /**
     * Validates the stock of products against the details provided.
     * @param {Array} produtscStock - Array of products with their stock information.
     * @param {Array} details - Array of invoice details containing product IDs and quantities. 
     * @throws {Error} - Throws an error if any product does not have enough stock for the requested quantity.
     * @return {void} - Returns nothing if all products have sufficient stock.
     */
    validateStockProduct(produtscStock, details) {
    // validate stock for each product
        for(const detail of details) {
            const product = produtscStock.find(p => p.id === detail.product_id)
            if(!product || product.stock < detail.quantity) {
                throw new Error(`Not enougth stock for this product: ${product.id}, Avaliale stock: ${product.stock}`)
            }
        }
    }
    
    /**
     * Calculates the total amount from an array of invoice products.
     * @param {Array} object - Array of products with invoice details.
     * @returns {number} - The total amount calculated from the products.
     */
    calculeTotalFromInvoice(object) {
        const total = object.map( product => {
            const quantity = product.invoice_details.dataValues.quantity
            const unitPrice = product.invoice_details.dataValues.unit_price
            return quantity * unitPrice
        })
        return total.reduce(( sum, acc) => sum + acc, 0)
    }

    /**
     * Convert dollar prices for products into a bolivars prices. 
     * @param {Array} products 
     * @param {Float} dollarvalue 
     * @returns {Array} array of products with prices in bolivars.
     */   
    _calculeBolivarPriceProducts(products, dollarvalue) {
        return products.map(product => {
            product.invoice_details.dataValues.unit_price = (product.invoice_details.dataValues.unit_price * dollarvalue.value).toFixed(2)
        })
    }

    /**
     * Based on invoice data create a text with a whatsapp link to send invoice info by whatsapp.
     * @param {Object} invoice 
     * @returns {String} A string with url to send invoice info by whatsapp. 
     */
    invoiceDataForWhatsapp(invoice) {
        return this.#error.handler(["Create invoice data for whatsapp"], async() => {
            const date = invoice.date.toLocaleDateString('es-VE')
            const hours = `${invoice.date.getHours()}:${invoice.date.getMinutes()}`
            const invoiceNumber = invoice.id.toString().padStart(8, '0');
            const customer = invoice.customer.name
            const products = invoice.dataValues.products.map(product => {
                return { name: product.name, quantity: product.invoice_details.dataValues.quantity, price: product.invoice_details.dataValues.unit_price }
            })
            const product_list = products.map(product => `${product.name} (${product.quantity}) x ${product.price} Bs `).join('\n')
            const total = invoice.total_reference
            const phone = invoice.customer.phone
            
            const data = `Pededido N°: ${invoiceNumber}\nFecha: ${date},  Hora: ${hours}\nCliente: ${customer}\n\nContenido:\n${product_list}\n\nTotal: ${total}`

            const encoded_data = encodeURIComponent(data)
            const waLink = `https://wa.me/${phone}?text=${encoded_data}`;
            
            return waLink
        })
    }
}

export default InvoiceService



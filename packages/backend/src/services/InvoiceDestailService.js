import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'
import SellerService from './SellerService.js'
import ProductService from './ProductService.js'
import CustomerCreditService from './CustomerCreditService.js'
import AuditLogService from './AuditLogService.js'
import { sequelize } from '../database/database.js'
import hasPassword from '../utils/encrypt.js'
import { NotFoundError } from '../errors/NofoundError.js'

class InvoiceDetailService {
    // instace of error handler
    #error = new ServiceErrorHandler()

    constructor(model, 
                sellerModel=null, 
                productModel=null, 
                invoiceReturnModel=null, 
                customerCreditModel=null, 
                invoiceModel=null,
                auditLogModel=null
            ) {
        this.InvoiceDetail = model
        this.SellerService = new SellerService(sellerModel)
        this.ProductService = new ProductService(productModel)
        this.CustomerCreditService = new CustomerCreditService(customerCreditModel)
        this.AuditLogService = new AuditLogService(auditLogModel)
        this.InvoiceReturn = invoiceReturnModel
        this.Invoice = invoiceModel
        this.#error
    }

    /**
     * Creates new invoice details.
     * @param {Array} details - An array of invoice detail objects to be created.
     * @return {Promise<Array>} - A promise that resolves to an array of created invoice detail objects.
     * @throws {ServiceError} - If an error occurs during invoice detail creation.
     */
    createInvoiceDetail(details) {
        return this.#error.handler(['Create Invoice Details'], async() => {
            const newDetails = await this.InvoiceDetail.bulkCreate(details)
            return newDetails
        })
    }
    
    /**
     * Update existing invoice details
     * @param {Array} updates - An array of objects containing the details to be updated.
     * @param {number} [updates.id] - The ID of the invoice detail to be updated.
     * @param {number} [updates.quantity] - The new quantity for the invoice detail.
     * @param {number} [updates.unit_price] - The new unit price for the invoice detail.
     * @param {number} [updates.product_id] - The ID of the product associated with the invoice detail.
     * Each object should have the properties: id, quantity, and unit_price.  
     * @returns {Promise<Array>} - A promise that resolves to an array of updated invoice detail objects.
     * @throws {ServiceError} - If an error occurs during the update operation.
     */
    updateInvoiceDetail(updates) {
        return this.#error.handler(['Update Details'], async() => {
            const updatedDetails = await this.InvoiceDetail.bulkCreate(updates, { 
                updateOnDuplicate: ['quantity', 'unit_price']})
            return updatedDetails
        })
    }

    /**
     * Retrieves an invoice detail by its ID.
     * @param {number} id - The ID of the invoice detail to retrieve.
     * @return {Promise<Object>} - A promise that resolves to the invoice detail object.
     * @throws {ServiceError} - If an error occurs during the retrieval operation.
     */
    getInvoiceDetail(id) {
        return this.#error.handler(['Read invoice Detail'], async() => {
            const detail = await this.InvoiceDetail.findByPk(id, {
                include: [
                    {
                        association: 'invoice',
                        include:[
                            {
                                association: 'payments-details',
                                where: { status: 'active' },
                                required: false,
                                include: [
                                    {
                                        association: 'payments',
                                        attributes: ['name', 'currency'],
                                        required: false,
                                    },
                                    
                                ],
                                attributes: ['id', 'amount', 'reference_amount', 'status']
                            }
                        ]
                    },
                    {
                        association: 'products',
                        attributes: ['name']
                    }
                ]
            })
            if (!detail) {
                throw new NotFoundError(`Invoice product detail not found`)
            }
            return detail
        })
    }

    /**
     * Retrieves invoice details by their IDs.
     * @param {Array} - ids - An array of invoice detail IDs to retrieve.
     * @returns {Promise<Array>} - A promise that resolves to an array of invoice detail objects.
     * @throws {ServiceError} - If an error occurs during the retrieval operation.
     */
    getInvoiceDetails(ids) {
        return this.#error.handler(['Read Invoice Details'], async() => {
            const details = await this.InvoiceDetail.findAll({
                where: {
                    id: ids
                }
            })
            return details
        })
    }

    /**
     * Retrieves invoice details by the associated invoice ID.
     * @param {number} invoiceId - The ID of the invoice for which to retrieve details.
     * @return {Promise<Array>} - A promise that resolves to an array of invoice detail objects.
     * @throws {ServiceError} - If an error occurs during the retrieval operation.
     */
    getDetailByInvoiceId(invoiceId, offset=0, limit=10) {
        return this.#error.handler(['Read Invoice Details by Invoice ID'], async() => {
            const details = await this.InvoiceDetail.findAll({
                include: [
                    {
                        association: 'products',
                        attributes: ['name'],
                    }
                ],
                where: {
                    invoice_id: invoiceId
                },
                attributes: ['id', 'quantity', 'unit_price'],
                offset: offset,
                limit: limit,
                order: [['products', 'name', 'ASC']]
            })
            return details
        })
    }

    /**
     * Retrieves the total count of products associated with a specific invoice.
     * @param {string|number} invoiceId - The unique identifier of the invoice.
     * @returns {Promise<number>} A promise that resolves to the total number of products.
     * @throws {Error} If the database query fails, handled by the internal error handler.
     */
    getTotalInvoiceProducts({invoiceId, limit = 5, paginated = true}, options = {}) {
        return this.#error.handler(['Read Total Invoice Products'], async () => {
            const totalProducts = await this.InvoiceDetail.count({
                where: { invoice_id: invoiceId },
                transaction: options.transaction || null
            })

            return paginated ? Math.ceil(totalProducts / limit) : totalProducts
        })
    }

    /**
     * Cancels an invoice item detail and processes the return.
     * @param {string} itemId - The ID of the invoice item to cancel.
     * @param {number} returnedQuantity - The quantity of the item to return.
     * @param {boolean} pinIsRequired - Indicates if a PIN is required for cancellation.
     * @param {string} pin - The PIN for authorization (if required).
     * @param {Object} currentUser - The currently logged-in user.
     * @return {Promise<void>} - A promise that resolves when the cancellation is complete.
     */
    cancelInvoiceItemDetail(itemsToReturn, pinIsRequired = true, pin = null, currentUser = {id: null, tenant_id: null}) {
        return this.#error.handler(['Process Bulk Returns', itemsToReturn.length, 'Invoice Detail'], async() => {

            const hashedPin = pinIsRequired ? hasPassword(pin, String(currentUser.tenant_id)) : null

            const t = await sequelize.transaction()

            // check if invoice if already paid 
            const invoiceId = await this._getInvoiceIdFromItem({itemId:itemsToReturn[0]['itemId']}, {transaction: t})
            
            const invoice = await this.Invoice.findByPk(invoiceId, {transaction: t})
            if (invoice.status != 'paid') {
                throw new Error('Invoice must be paid before to return items.')
            }

            try{
                //1. check if user is authorized to cancel item 
                const authorizedBy = pinIsRequired ? await this.SellerService.authorizeSeller(hashedPin, { transaction: t }) : null

                //2. get details info and set up necessary data for the return process
                let totalAmountToReturn = 0
                const returnToCreate = []

                for (const item of itemsToReturn) {
                    // A. get product detail info
                    const detail = await this.getInvoiceDetail(item.itemId)
                    
                    // c. validate returned quantity
                     const totalAlreadyReturned = await this.InvoiceReturn.sum('quantity', {
                                where: {
                                    invoice_detail_id: item.itemId
                                },
                                transaction: t
                            }) || 0
                    // D. calcule max allowed returned items
                    const maxAllowed = detail.quantity - totalAlreadyReturned

                    // E . verify returned Quantity is not greater than original quantity
                    if (item.returnedQuantity > maxAllowed) {
                        throw new Error
                        (`Quantity captures fraud for item ${detail.products?.name || 'unknown product'}. Max allowed: ${maxAllowed}`)
                    }

                    //F restore product stock
                    await this.ProductService.restoreStock({product_id: detail.product_id, quantity: item.returnedQuantity}, {transaction: t})

                    //G calcule credit amount to return
                    const itemAmount = (detail.unit_price * item.returnedQuantity).toFixed(2)
                    
                    totalAmountToReturn += itemAmount

                    //H prepare return to create
                    returnToCreate.push({
                        invoice_id: detail.invoice_id,
                        invoice_detail_id: item.itemId,
                        quantity: item.returnedQuantity,
                        amount_returned: itemAmount,
                        user_id: currentUser.id,
                        supervisor_seller_id: authorizedBy?.authorizedBy?.id || null
                    })
                }

                //6. create new customer credit and get customer info
                const {customerCredit: newCredit} = await this.CustomerCreditService.createCustomerCredit(
                    {
                        customer_id: invoice.customer_id,
                        origin_invoice_id: invoiceId,
                        amount: totalAmountToReturn,
                        payment_method_id: 8,
                    },
                    {
                        transaction: t
                    }
                )
                //7. Record the return history
                const finalReturns = returnToCreate.map(returnItem => ({
                    ...returnItem,
                    customer_credit_id: newCredit.id
                }))
                await this.InvoiceReturn.bulkCreate(finalReturns, { transaction: t })


                //8. update invoice refund status
                const refundStatus = await this._calculaRefundStatus(invoiceId, {transaction: t})
                await this._updateInvoiceRefundStatus({invoice_id: invoiceId, status: refundStatus}, {transaction: t})

                //9. create new audit log
                await this.AuditLogService.createAuditLog({
                    action: refundStatus == 'full' ? 'FULL_REFUND' : 'PARTIAL_REFUND',
                    tableName: 'invoice_returns',
                    recordId: invoiceId,
                    details: {
                        oldSnapshot: {
                            status: invoice.refund_status,
                            invoiceId: invoiceId,
                        },
                        newSnapshot: {
                            status: refundStatus,
                            total_credit_generated: totalAmountToReturn,
                            invoiceId: invoiceId,
                        },
                    },
                    userId: currentUser.id,
                    supervisor_seller_id: authorizedBy?.authorizedBy?.id || null
                },
                {
                    transaction: t
                })

                await t.commit()

                return {
                     success: true 
                }
            }catch(error) {
                await t.rollback()
                throw error
            }
        })
    }
 
    /**
     * Deletes invoice details by their IDs.
     * @param {Array} ids - An array of invoice detail IDs to delete.
     * @return {Promise<void>} - A promise that resolves when the deletion is complete.
     * @throws {ServiceError} - If an error occurs during the deletion operation.
     */
    deleteInvoiceDetail(ids) {
        return this.#error.handler(['Delete Invoice Details'], async() => {
            await this.InvoiceDetail.destroy({
                where: {
                    id: ids
                }
            })
        })
    }

    /**
     * Calculates the refund status for a given invoice.
     * @param {string} invoice_id - The ID of the invoice.
     * @param {Object} options - The options for the calculation.
     * @return {Promise<string>} - A promise that resolves to the refund status.
     */
    async _calculaRefundStatus(invoice_id, options = {}) {
        //1. get invoice total products quantity
        const InvoiceProducts = await this.getDetailByInvoiceId(invoice_id, null, null)
        const totalProducts = InvoiceProducts.reduce((total, product) => total + product.quantity, 0)
        
        //2. get total returned products quantity
        const returnedRows = await this.InvoiceReturn.findAll({
            where: {
                invoice_id: invoice_id
            },
            transaction: options.transaction || null
        }) || 0 
        const totalReturned = returnedRows.reduce((total, row) => total + row.quantity, 0)
        //3. return refund status 
        return totalReturned === 0 ? 'none' : totalReturned >= totalProducts ? 'full' : 'partial'
    }

    /**
     * Updates the refund status of an invoice.
     * @param {Object} params - The parameters for updating the refund status.
     * @param {string} params.invoice_id - The ID of the invoice.
     * @param {string} params.status - The new refund status.
     * @param {Object} options - The options for the update.
     * @return {Promise<void>} - A promise that resolves when the update is complete.
     */
    async _updateInvoiceRefundStatus({invoice_id, status}, options = {}) {
        //1. get invoice 
        const invoice = await this.Invoice.findByPk(invoice_id)
        //2. update invoice status
        await invoice.update({refund_status: status},{ transaction: options.transaction || null })
        await invoice.save()

    }


    async _getInvoiceIdFromItem({itemId}, options = {}) {
        const invoiceId = await this.InvoiceDetail.findByPk(itemId, {
            attributes: ['invoice_id'],
            transaction: options.transaction || null
        })
        return invoiceId?.invoice_id || null
    }
    
}

export default InvoiceDetailService
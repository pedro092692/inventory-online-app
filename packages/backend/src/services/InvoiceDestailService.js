import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'

class InvoiceDetailService {

    // instace of error handler
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.InvoiceDetail = model
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
            const detail = await this.InvoiceDetail.findByPk(id)
            return detail
        })
    }

    /**
     * 
     * @param {Array} - ids - An array of invoice detail IDs to retrieve.
     * Retrieves invoice details by their IDs. 
     * @returns <Promise<Array>} - A promise that resolves to an array of invoice detail objects.
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
    getDetailByInvoiceId(invoiceId) {
        return this.#error.handler(['Read Invoice Details by Invoice ID'], async() => {
            const details = await this.InvoiceDetail.findAll({
                where: {
                    invoice_id: invoiceId
                }
            })
            return details
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
    
}

export default InvoiceDetailService
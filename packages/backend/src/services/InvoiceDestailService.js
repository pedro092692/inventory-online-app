import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"

class InvoiceDetailService {

    // instace of error handler
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.InvoiceDetail = model
        this.#error
    }


    createInvoiceDetail(details) {
        return this.#error.handler(["Create Invoice Details"], async() => {
            const newDetails = await this.InvoiceDetail.bulkCreate(details)
            return newDetails
        })
    }

    updateInvoiceDetail(updates) {
        return this.#error.handler(["Update Details"], async() => {
            const updatedDetails = await this.InvoiceDetail.bulkCreate(updates, { 
                updateOnDuplicate: ["quantity", "unit_price"]})

            return updatedDetails
        })
    }

    getInvoiceDetail(id) {
        return this.#error.handler(["Read invoice Detail"], async() => {
            const detail = await this.InvoiceDetail.findByPk(id)
            return detail
        })
    }

    getInvoiceDetails(ids) {
        return this.#error.handler(["Read Invoice Details"], async() => {
            const details = await this.InvoiceDetail.findAll({
                where: {
                    id: ids
                }
            })
            return details
        })
    }

    getDetailByInvoiceId(invoiceId) {
        return this.#error.handler(["Read Invoice Details by Invoice ID"], async() => {
            const details = await this.InvoiceDetail.findAll({
                where: {
                    invoice_id: invoiceId
                }
            })
            return details
        })
    }

    deleteInvoiceDetail(ids) {
        return this.#error.handler(["Delete Invoice Details"], async() => {
            await this.InvoiceDetail.destroy({
                where: {
                    id: ids
                }
            })
        })
    }
    
}

export default InvoiceDetailService
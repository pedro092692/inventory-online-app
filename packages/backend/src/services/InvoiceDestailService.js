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
                updateOnDuplicate: ["quantity", "unit_price"]
            })

            return updatedDetails
        })
    }
}

export default InvoiceDetailService
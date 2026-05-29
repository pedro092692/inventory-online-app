import ServiceErrorHandler from './errors/ServiceErrorHandler.js'

class InvoiceReturnService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.InvoiceReturn = model
        this.#error 
    }


    processPartialReturn(invoice_id, invoice_detail_id, customer_credit_id, quantity, user_id, supervisor_seller_id=null) {
        return this.#error.handler(['Process Partial Return'], async() => {
            newPartialReturn = await this.InvoiceReturn.create({
                invoice_id,
                invoice_detail_id,
                customer_credit_id,
                quantity,
                user_id,
                supervisor_seller_id
            })

            return {
                newPartialReturn: newPartialReturn
            }
        })
    }
}
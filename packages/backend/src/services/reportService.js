import ServiceErrorHandler from "../errors/ServiceErrorHandler";



class ReportService {
    // new instace of service error handler
    #error = new ServiceErrorHandler()

    constructor(invoiceModel) {
        this.invoice = invoiceModel
        this.#error
    }

    getTopSpendingCustomer() {
        return this.#error.handler(["Get best Customers"], async() => {
            const customer = await this.invoice.findAll({
                order: ['total', 'DESC'],
                limit: 10
            })
            return customer
        })
    }
}

export default ReportService
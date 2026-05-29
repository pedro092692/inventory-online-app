import ServiceErrorHandler from './errors/ServiceErrorHandler.js'

class InvoiceReturnService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.InvoiceReturn = model
        this.#error 
    }


    processPartialReturn() {
        return this.#error.handler(['Process Partial Return'], async() => {
            
        })
    }
}
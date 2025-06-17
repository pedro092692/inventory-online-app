import ServiceErrorHandler from "../errors/ServiceErrorHandler"
import { NotFoundError } from "../errors/NofoundError"

class DollarValue {
    
    // Service Error handler instance 
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.DollarValue = model
        this.#error
    }

    /**
     * 
     * @param {number} - The value of the current dollar price.
     * @return {Promise<Object>} - A promise that resolves to an object of created new dollar value price.
     * @throws {ServiceError} - If an error occurs during create dollar value.
     */
    createDollarValue(value) {
        return this.#error.handler(["Create Dollar Value"], async() => {
            const newDollarValue = this.DollarValue.create({
                value
            })
            return newDollarValue
        })
    }

}
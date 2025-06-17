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
            const newDollarValue = await this.DollarValue.create({
                value
            })
            return newDollarValue
        })
    }

    /**
     * Retrieves a dollar value by its ID.
     * @param {Number} id - id of the dollar value to retrieve
     * @returns {Promise<Object>} - returns the dollar value with the given id
     * @throws {ServiceError} - throws an error if the dollar value could not be retrieved
     */
    getDollarValue(id) {
        return this.#error.handler(["Read Dollar Value", id, "Dollar Value"], async() => {
            const dollarValue = await this.DollarValue.findByPk(id, {
                attributes: ["value"]
            }) 
            
            if(!dollarValue) {
                throw new NotFoundError()
            }

            return dollarValue
        })
    }

    /**
     * Retrieves a dollar last dollar value.
     * @returns {Promise<Object>} - returns the last dollar value.
     * @throws {ServiceError} - throws an error if the last dollar value could not be retrieved
     */
    getLastValue() {
        return this.#error.handler(["Read Last Dollar Value"], async() => {
            const lastDollarValue = await this.DollarValue.findOne({
                order: [ ["id", "DESC"] ],
                limit: 1
            })

            if(!lastDollarValue) {
                throw new NotFoundError()
            }

            return lastDollarValue
        })
    }


    updateDollarValue(id, value) {
        return this.#error.handler(["Update Dollar Value", id, "Dollar Value"], async() => {
            const dollarValue = await this.getDollarValue(id)
            const updatedDollarValue = dollarValue.update({
                value: value, 
                date: new Date()
            })
            return updatedDollarValue
        })
    }


    deleteDollarValue(id) {
        return this.#error.handler(["Delete Dollar Value", id, "Dollar Value"], async() => {
            const dollarValue = await this.getDollarValue(id)
            // delete dollar value
            await dollarValue.destroy()
            return 1
        })
    }

}


export default DollarValue
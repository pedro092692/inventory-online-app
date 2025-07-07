import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import { NotFoundError } from "../errors/NofoundError.js"

class DollarValueService {
    
    // Service Error handler instance 
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.DollarValue = model
        this.#error
    }

    /**
     * 
     * @param {number} value - The value of the current dollar price.
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
            const dollarValue = await this.DollarValue.findByPk(id) 
            
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

    /**
     * Update a Dollar vaule by its ID
     * @returns {Promise<Object>} - returns the updated dollar value.
     * @throws {ServiceError} - throws an error if the dollar value could not be updated
     */
    updateDollarValue(id, value) {
        return this.#error.handler(["Update Dollar Value", id, "Dollar Value"], async() => {
            const dollarValue = await this.getDollarValue(id)
            const updatedDollarValue = await dollarValue.update({
                value: value, 
                date: new Date()
            })
            return updatedDollarValue
        })
    }

    /**
     * Delete a dollar value by its ID
     * @returns {Promise<Object>} - returns 1 if the dollar value is deleted.
     * @throws {ServiceError} - throws an error if the dollar value could not be deleted.
     */
    deleteDollarValue(id) {
        return this.#error.handler(["Delete Dollar Value", id, "Dollar Value"], async() => {
            const dollarValue = await this.getDollarValue(id)
            // delete dollar value
            await dollarValue.destroy()
            return 1
        })
    }

}


export default DollarValueService
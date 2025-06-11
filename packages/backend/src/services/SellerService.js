import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import { NotFoundError } from "../errors/NofoundError.js"

class SellerService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.Seller = model
        this.#error
    }
    /**
     * Creates a new seller.
     * @param {Number} id_number - id number of the seller
     * @param {String} name - name of the seller
     * @param {String} last_name - last name of the seller
     * @param {Strind} address - address of the seller
     * @throws {ServiceError} - throws an error if the seller could not be created
     * @returns {Promise<Object>} - returns the created seller
     */
    createSeller(id_number, name, last_name, address) {
        return this.#error.handler(["Create Seller"], async() => {
            const newSeller = await this.Seller.create({
                id_number: id_number,
                name: name,
                last_name: last_name,
                address: address
            })
            return newSeller
        })
    }

    /**
     * Get all sellers with pagination.
     * @description Retrieves all sellers with their sales, limited by the specified limit and offset.
     * @param {Number} limit - limit of sellers to return
     * @param {Number} offset - offset of sellers to return
     * @throws {ServiceError} - throws an error if the sellers could not be retrieved
     * @returns {Promise<Array>} - returns an array of sellers with their sales
     */
    getAllSellers(limit=10, offset=0) {
        return this.#error.handler(["Read All Sellers"], async() => {
            const sellers = await this.Seller.findAll({
                 include: {
                    association: "sales",
                    attributes: ["id", "date", "total"]
                },
                order: [["sales", "id", "DESC"]],
                limit: limit,
                offset: offset
            })
            return sellers
        })
    }

    /**
     * Retrieves a seller by their ID.
     * @description Retrieves a seller with their sales by the given ID.
     * @param {Number} id - ID of the seller to retrieve
     * @throws {ServiceError} - throws an error if the seller could not be found
     * @returns {Promise<Object>} - returns the seller with their sales
     */ 
    getSeller(id) {
        return this.#error.handler(["Read Seller", id, "Seller"], async () => {
            const seller = await this.Seller.findByPk(id, {
                include: {
                    association: "sales",
                    attributes: ["id", "date", "total"]
                },
                order: [["sales", "id", "DESC"]],
            })

            if(!seller) {
                throw new NotFoundError()
            }

            return seller
        })
    }

    /**
     * Updates a seller by their ID.
     * @description Updates the seller with the given ID using the provided updates.
     * @param {Number} sellerId - ID of the seller to update
     * @param {Object} updates - object containing the updates to apply
     * @param {String} updates.id_number - id number of the seller
     * @param {String} updates.name - name of the seller
     * @param {String} updates.last_name - last name of the seller
     * @param {String} updates.address - address of the seller
     * @throws {NotFoundError} - throws an error if the seller with the given ID does not exist
     * @throws {ServiceError} - throws an error if the seller could not be updated
     * @returns {Promise<Object>} - returns the updated seller
     */
    updateSeller(sellerId, updates) {
        return this.#error.handler(["Update Seller", sellerId, "Seller"], async() => {
            const seller = await this.getSeller(sellerId)
            const updatedSeller = await seller.update(updates)
            return updatedSeller
        })
    }

    /**
     * Deletes a seller by their ID.
     * @description Deletes the seller with the given ID.
     * @param {Number} sellerId - ID of the seller to delete
     * @throws {NotFoundError} - throws an error if the seller with the given ID does not exist
     * @throws {ServiceError} - throws an error if the seller could not be deleted
     * @returns {Promise<Number>} - returns 1 if the seller was deleted successfully
     */
    deleteSeller(sellerId) {
        return this.#error.handler(["Delete Seller", sellerId, "Seller"], async() => {
            const seller = await this.getSeller(sellerId)
            // delete seller 
            await seller.destroy()
            return 1
        })
    }
     
}

export default SellerService
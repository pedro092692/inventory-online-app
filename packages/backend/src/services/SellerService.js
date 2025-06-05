import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"
import { NotFoundError } from "../errors/NofoundError.js"

class SellerService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.Seller = model
        this.#error
    }

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

    updateSeller(sellerId, updates) {
        return this.#error.handler(["Update Seller", sellerId, "Seller"], async() => {
            const seller = await this.getSeller(sellerId)
            const updatedSeller = await seller.update(updates)
            return updatedSeller
        })
    }
     
}

export default SellerService
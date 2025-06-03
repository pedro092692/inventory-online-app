import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"

class SellerService {
    // new instance of service error handler 
    #error = new ServiceErrorHandler()

    constructor(model) {
        this.Seller = model
        this.#error
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
            return seller
        })
    }
     
}

export default SellerService
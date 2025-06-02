class SellerService {
    constructor(model) {
        this.Seller = model
    }

    async getAllSellers() {
        try {
            return await this.Seller.findAll({
                include: {
                    association: "sales",
                    attributes: ["id", "date", "total"]
                },
                order: [["sales", "id", "DESC"]],
                limit: 10,
                offset: 0
            })
        }catch(error) {
            throw new Error(`Error fetching Seller: ${error.message}`)
        }
    }
}

export default SellerService
import SellerService from "../services/SellerService.js"

class SellerController {
    constructor(model) {
        this.sellerService = new SellerService(model)
    }

    async allSeller(req, res) {
        try{
            const sellers = await this.sellerService.getAllSellers()
            res.status(200).json(sellers)
        }catch(error) {
            res.status(500).json({ message: error.message })
        }
    }
}

export default SellerController
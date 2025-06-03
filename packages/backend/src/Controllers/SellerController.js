import SellerService from "../services/SellerService.js"
import controllerErrorHandler from "../errors/controllerErrorHandler.js"

class SellerController {
    // new instance of controller error handler
    #error = new controllerErrorHandler()

    constructor(model) {
        this.sellerService = new SellerService(model)
        this.#error
    }


    allSeller = this.#error.handler(async(req, res) => {
        const sellers = await this.sellerService.getAllSellers()
        res.status(200).json(sellers)
    })

    getSeller = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const seller = await this.sellerService.getSeller(id)
        res.status(200).json(seller) 
    })
}

export default SellerController
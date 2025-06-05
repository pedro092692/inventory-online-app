import SellerService from "../services/SellerService.js"
import controllerErrorHandler from "../errors/controllerErrorHandler.js"

class SellerController {
    // new instance of controller error handler
    #error = new controllerErrorHandler()

    constructor(model) {
        this.sellerService = new SellerService(model)
        this.#error
    }

    createSeller = this.#error.handler( async(req, res) => {
        const { id_number, name, last_name, address } = req.body
        const seller = await this.sellerService.createSeller(id_number, name, last_name, address)
        res.status(200).json(seller)
    })


    allSeller = this.#error.handler(async(req, res) => {
        const sellers = await this.sellerService.getAllSellers()
        res.status(200).json(sellers)
    })

    getSeller = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const seller = await this.sellerService.getSeller(id)
        res.status(200).json(seller)
    })

    updateSeller = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const updates = req.body 
        const updatedSeller = await this.sellerService.updateSeller(id, updates)
        res.status(200).json(updatedSeller)
    })

    deleteSeller = this.#error.handler( async(req, res) => {
        const sellerId = req.body.sellerId
        // delete seller 
        await this.sellerService.deleteSeller(sellerId)
        res.status(204).json({})
    })
}

export default SellerController
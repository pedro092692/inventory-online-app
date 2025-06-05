import ProductService from "../services/ProductService.js";
import controllerErrorHandler from "../errors/controllerErrorHandler.js";

class ProductController{
    // error controller new instace 
    #error = new controllerErrorHandler()
    
    constructor(model) {
        this.ProductService = new ProductService(model)
        this.#error
    }

    createProduct = this.#error.handler( async(req, res) => {
        const { barcode, name, purchase_price, selling_price, stock } = req.body
        const product = await this.ProductService.createProduct(barcode, name, purchase_price, selling_price, stock)
        res.status(200).json(product)
    })

    allProducts = this.#error.handler( async(req, res) => {
        const products = await this.ProductService.getAllProducts()
        res.status(200).json(products)
    })

    getProduct = this.#error.handler( async(req, res) => {
        const { id } = req.params
        const product = await this.ProductService.getProduct(id)
        res.status(200).json(product)
    })

  

    
}

export default ProductController
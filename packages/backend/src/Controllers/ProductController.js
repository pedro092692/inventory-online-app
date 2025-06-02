import ProductService from "../services/ProductService.js";

class ProductController{
    constructor(model) {
        this.ProductService = new ProductService(model)
    }

    async allProducts(req, res) {
        try {
             const products = await this.ProductService.getAllProducts()
             res.status(200).json(products)
        }catch(error) {
             res.status(500).json({ message: error.message })
        }
    }
}

export default ProductController
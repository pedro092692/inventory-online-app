class ProductService{
    constructor(model) {
        this.Product = model
    }

    async getAllProducts() {
        try {
            return await this.Product.findAll({
                limit: 10,
                offset: 0
            })
        } catch(error) {
            throw new Error(`Error fetching products: ${error.message}`)
        }
    }
}

export default ProductService
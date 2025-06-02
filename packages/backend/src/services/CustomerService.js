class CustomerService {
    constructor(model) {
        this.Customer = model
    }

    async getAllCustomers() {
        try {
            return await this.Customer.findAll({
                include: {
                    association: "invoices",
                    attributes: ["id", "date", "total"],
                },
                order: [["id", "DESC"], ["invoices", "id", "DESC"]],
                limit: 10,
                offset: 0,
            })
        } catch (error) {
            throw new Error(`Error fetching customers: ${error.message}`)
        }
    }

    async getCustomerById(id) {
        try {
            const user = await this.Customer.findByPk(id)
            if (!user) {
                throw new Error(`Customer with id ${id} not found`)
            }
            return user
        } catch (error) {
            throw new Error(`Error fetching customer: ${error.message}`)
        }
    }
}
    
export default CustomerService
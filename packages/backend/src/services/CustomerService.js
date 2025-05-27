class CustomerService {
    constructor(model) {
        this.User = model
    }

    async getAllCustomers() {
        try {
            return await this.User.findAll({
                limit: 10,
                offset: 0
            })
        } catch (error) {
            throw new Error(`Error fetching users: ${error.message}`)
        }
    }

    async getCustomerById(id) {
        try {
            const user = await this.User.findByPk(id)
            if (!user) {
                throw new Error(`User with id ${id} not found`)
            }
            return user
        } catch (error) {
            throw new Error(`Error fetching user: ${error.message}`)
        }
    }
}
    
export default CustomerService
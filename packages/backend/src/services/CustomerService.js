import ServiceErrorHandler from "../errors/ServiceErrorHandler.js"

class CustomerService {

    // instance of error handler 
    #error = new ServiceErrorHandler()
    
    constructor(model) {
        this.Customer = model
        this.#error
    }

    getAllCustomers(limit=10, offset=0) {
        return this.#error.handler("Read All Users", async () => {
            const customers = await this.Customer.findAll({
                include: {
                    association: "invoices",
                    attributes: ["id", "date", "total"],
                },
                order: [["id", "DESC"], ["invoices", "id", "DESC"]],

                limit: limit,
                offset: offset
            })
            return customers
        })
    }

    getCustomerById(id) {
        return this.#error.handler(["Read User", id, "User"], async () => {
            const user = await this.Customer.findByPk(id)
            return user
        })
    }
}
    
export default CustomerService
import ServiceErrorHandler from "../errors/ServiceErrorHandler.js";
import { Sequelize } from "sequelize"


class ReportService {
    // new instace of service error handler
    #error = new ServiceErrorHandler()

    constructor(invoiceModel) {
        this.invoice = invoiceModel
        this.#error
    }

    getTopSpendingCustomer() {
        return this.#error.handler(["Get best Customers"], async() => {
            const customer = await this.invoice.findAll({
                where: {
                    status: 'paid'
                },
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.col('total')), 'total_spent'],
                    [Sequelize.fn('MIN', Sequelize.col('date')), 'first_invoice'],
                    [Sequelize.fn('MAX', Sequelize.col('date')), 'last_invoice']
                ],
                include:[
                    {
                        association: "customer", attributes: ["name", "phone"]
                    }
                ],
                group: ['customer_id', 'customer.id'],
                order:[
                    [[Sequelize.literal('total_spent'), 'DESC']]
                ],
                limit: 10
            })

            const formatted_client_list = customer.map((client) => {
                return {
                    name: client.customer.name,
                    total_spent: client.dataValues.total_spent,
                    first_purchase: client.dataValues.first_invoice.toLocaleDateString('es-VE'),
                    last_purcahse: client.dataValues.last_invoice.toLocaleDateString('es-VE'),
                    phone: client.customer.phone
                    
                }
            })
            return formatted_client_list
        })
    }
}

export default ReportService
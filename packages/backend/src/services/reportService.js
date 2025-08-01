import ServiceErrorHandler from "../errors/ServiceErrorHandler.js";
import { Sequelize } from "sequelize"


class ReportService {
    // new instace of service error handler
    #error = new ServiceErrorHandler()

    constructor(invoiceModel, invoiceDetailModel=null) {
        this.invoice = invoiceModel
        this.invoiceDetail = invoiceDetailModel
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
                        association: "customer", attributes: ["name", "phone", "id"]
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
                    id: client.customer.id,
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

    getTopRecurringCustomer() {
        return this.#error.handler(["Get recurring Customer"], async() => {
            const customers = await this.invoice.findAll({
                where: {
                    status: "paid"
                },
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('customer_id')), 'total_recurring'],
                    [Sequelize.fn('MIN', Sequelize.col('date')), 'first_invoice'],
                    [Sequelize.fn('MAX', Sequelize.col('date')), 'last_invoice']
                ],
                include:[
                    {
                        association: "customer", attributes: ["name", "phone", "id"]
                    }
                ],
                group: ['customer_id', 'customer.id'],
                order:[
                    [[Sequelize.literal('total_recurring'), 'DESC']]
                ],
                limit: 10
            })

            return customers
        })
    }

    getToSellingProduct(order = 'DESC') {
        return this.#error.handler(["Get Top Selling products"], async() => {
            const products = await this.invoiceDetail.findAll({
                attributes: [
                    "product_id",
                    [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_sold']
                ],
                include:[
                    {
                        association: "products",
                        attributes: ["name", "selling_price"]
                    },
                    {
                        association: "invoice",
                        attributes:[],
                        where:{
                            status: 'paid',
                            // date: {
                                // [Sequelize.Op.between]: [startDate, endDate]
                            // }
                        }
                    }
                ],
                group: ["product_id", "products.id"],
                order: [
                     [[Sequelize.literal('total_sold'), order]]
                ],
                limit: 10
            })

            return products
        })
    }

    bestSellingDay(order = 'DESC', limit = 1) {
        return this.#error.handler(['Get Best Selling Day'], async() => {
            const today = new Date()
            const startDate = new Date(today)
            //set start date to 1 of the current month
            startDate.setDate(today.getDate() - 30)
            startDate.setHours(0, 0, 0, 0)

            const data = await this.invoice.findAll({
                where:{
                    status: 'paid',
                    date:{
                        [Sequelize.Op.between]: [startDate, today]
                    }
                },
                attributes:[
                    [Sequelize.fn('DATE', Sequelize.col('date')), 'day'],
                    [Sequelize.fn('COUNT', Sequelize.col('*')), 'sales'],
                    [Sequelize.fn('SUM', Sequelize.col('total')), 'revenue']
                ],
                group: [Sequelize.literal('day')],
                order: [[Sequelize.literal('revenue'), order]],
                limit: limit

            })

            return data
        })
    }

    salesPerDay() {
        return this.#error.handler(['Get sales per Day'], async() => {
            const today = new Date()
            const startDate = new Date(today)
            //set start date to 1 of the current month
            startDate.setDate(today.getDate() - 30)
            startDate.setHours(0, 0, 0, 0)

            const data = await this.invoice.findAll({
                where:{
                    status: 'paid',
                    date:{
                        [Sequelize.Op.between]: [startDate, today]
                    }
                },
                attributes:[
                    [Sequelize.fn('DATE', Sequelize.col('date')), 'day'],
                    [Sequelize.fn('COUNT', Sequelize.col('*')), 'sales'],
                    [Sequelize.fn('SUM', Sequelize.col('total')), 'revenue']
                ],
                group: [Sequelize.literal('day')],
                order: [[Sequelize.literal('day'), 'ASC']],
            })

            return data
        })
    }

    peakSalesHour() {
        return this.#error.handler(['Get peak sales hours'], async() => {
            const today = new Date()
            const startDate = new Date(today)
            //set start date to 1 of the current month
            startDate.setDate(today.getDate() - 30)
            startDate.setHours(0, 0, 0, 0)
            
            const data = await this.invoice.findAll({
                attributes:[
                    [Sequelize.fn('DATE_TRUNC', 'hour', Sequelize.col('date')), 'hour'],
                    [Sequelize.fn('COUNT', Sequelize.col('*')), 'Sales'],
                    [Sequelize.fn('SUM', Sequelize.col('total')), 'revenue']
                ],
                where:{
                    status: 'paid',
                    date: {
                        [Sequelize.Op.between]: [startDate, today]
                    }
                },
                group: [Sequelize.literal('hour')],
                order: [[Sequelize.literal('revenue'), 'DESC']],
                limit: 10
            })

            return data
        })
    }

}

export default ReportService
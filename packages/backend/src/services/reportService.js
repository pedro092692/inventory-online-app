import ServiceErrorHandler from "../errors/ServiceErrorHandler.js";
import { Sequelize } from "sequelize"


class ReportService {
    // new instace of service error handler
    #error = new ServiceErrorHandler()

    constructor(invoiceModel, invoiceDetailModel=null, invoicePayDetailModel=null) {
        this.invoice = invoiceModel
        this.invoiceDetail = invoiceDetailModel,
        this.invoicePayDetail = invoicePayDetailModel
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
            const targetTimeZone = 'Europe/Madrid';
            const today = new Date()
            const startDate = new Date(today.getDate() - 30)
            // get last 30 days
            startDate.setDate(today.getDate())
            startDate.setHours(0, 0, 0, 0)
            
            const data = await this.invoice.findAll({
                attributes:[
                    [Sequelize.fn('EXTRACT', Sequelize.literal(`HOUR FROM "date" AT TIME ZONE '${targetTimeZone}'`)), 'hourOfDay'],
                    [Sequelize.fn('COUNT', Sequelize.col('*')), 'Sales'],
                    [Sequelize.fn('SUM', Sequelize.col('total')), 'revenue']
                ],
                where:{
                    status: 'paid',
                    date: {
                        [Sequelize.Op.between]: [startDate, today]
                    }
                },
                group: [Sequelize.literal(`EXTRACT(HOUR FROM "date" AT TIME ZONE '${targetTimeZone}')`)],
                order: [[Sequelize.literal('SUM(total)'), 'DESC']],
                limit: 3
            })

            return data
        })
    }

    peakSalesDayOfWeek() {
        return this.#error.handler(['Get peak sales day of week'], async() => {
            const today = new Date()
            const startDate = new Date(today)
            startDate.setDate(today.getDate() - 30)
            startDate.setHours(0, 0, 0, 0)
            const targetTimeZone = 'Europe/Madrid'

            const data = await this.invoice.findAll({
                attributes: [
                    [Sequelize.fn('EXTRACT', 
                        Sequelize.literal(`DOW FROM "date" AT TIME ZONE '${targetTimeZone}'`)), 'dayOfWeekNumber'],
                    [Sequelize.fn('COUNT', Sequelize.col('*')), 'totalSales'],
                    [Sequelize.fn('SUM', Sequelize.col('total')), 'totalRevenue']
                ],
                where:{
                    status: 'paid',
                    date: {
                        [Sequelize.Op.between]: [startDate, today]
                    }
                },
                group: [Sequelize.fn('EXTRACT', 
                        Sequelize.literal(`DOW FROM "date" AT TIME ZONE '${targetTimeZone}'`)), 'dayOfWeekNumber'],
                order: [[Sequelize.literal('SUM(total)'), 'DESC']]       
            })

            const daysNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
            const result = data.map(item => {
                const dayNumber = parseInt(item.dataValues.dayOfWeekNumber, 10)
                return {
                    dayOfWeek: daysNames[dayNumber],
                    totalSales: parseInt(item.dataValues.totalSales, 10),
                    totalRevenue: parseFloat(item.dataValues.totalRevenue).toFixed(2)
                }
            })

            return result
        })
    }

    dayTotalSales() {
        return this.#error.handler(['Get total sales day'], async() => {
            const today = new Date( )
            const startDate = new Date(today)
            startDate.setDate(today.getDate() - 30)
            startDate.setHours(0, 0, 0, 0)

            const data = await this.invoicePayDetail.findAll({
                attributes:[
                    [Sequelize.fn("DATE", Sequelize.col("invoice.date")), "day"],
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_currenty'],
                    [Sequelize.fn("SUM", Sequelize.col("reference_amount")), "total_dollar"],
                    [Sequelize.fn('COUNT', Sequelize.col("invoice.id")), 'transactions']
                ],
                include:[
                    {
                        association: "payments",
                        attributes: ["name", "currency"]
                    },
                    {
                        association: "invoice",
                        attributes: [],
                        where:{
                            status: "paid",
                            // seller_id: 1
                            // [Sequelize.Op.and]: Sequelize.where(
                            //     Sequelize.fn('DATE', Sequelize.col('date')), '2025-08-04'
                            // )
                            date: {
                                [Sequelize.Op.between]: [startDate, today]
                                
                            }
                        }
                    }
                ],
                group: [
                    Sequelize.fn('DATE', Sequelize.col('invoice.date')),
                    "payment_id", 
                    "payments.id"
                ],
                order: [
                    [[Sequelize.literal('day'), 'DESC']]
                ]

            })
            
            return data
        })
    }

    getInvoicePerDate() {
        return this.#error.handler(['Read Invoices Per Date'], async() => {
            const today = new Date()
            const startDate = new Date(today)
            startDate.setDate(today.getDate() - 7)
            startDate.setHours(0, 0, 0, 0)

            const data = await this.invoice.findAll({
                attributes: [
                    "id",
                    "date",
                    "total",
                ],
                include: [
                    {
                        association: "seller", 
                        attributes: ["name"]
                    },
                    {
                        association: "customer",
                        attributes: ["name", "phone"]
                    }
                ],
                where:{
                    status: "paid",
                    date: {
                        [Sequelize.Op.between]: [startDate, today]
                    }
                },
                order:[["date", "DESC"]],
                limit: 4
            })

            return data
        })
    }

    cashClosing(seller_id) {
         return this.#error.handler(['Get total sales day'], async() => {
            const today = new Date()
            const data = await this.invoicePayDetail.findAll({
                attributes:[
                    [Sequelize.fn("DATE", Sequelize.col("invoice.date")), "day"],
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_currenty'],
                    [Sequelize.fn("SUM", Sequelize.col("reference_amount")), "total_dollar"],
                    [Sequelize.fn('COUNT', Sequelize.col("invoice.id")), 'transactions']
                ],
                include:[
                    {
                        association: "payments",
                        attributes: ["name", "currency"]
                    },
                    {
                        association: "invoice",
                        attributes: [],
                        where:{
                            status: "paid",
                            seller_id: seller_id,
                            [Sequelize.Op.and]: Sequelize.where(
                                Sequelize.fn('DATE', Sequelize.col('date')), `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
                            )
                        }
                    }
                ],
                group: [
                    Sequelize.fn('DATE', Sequelize.col('invoice.date')),
                    "payment_id", 
                    "payments.id"
                ],
                order: [
                    [[Sequelize.literal('day'), 'DESC']]
                ]

            })
            
            return data
        })
    }

}

export default ReportService
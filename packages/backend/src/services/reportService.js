import ServiceErrorHandler from '../errors/ServiceErrorHandler.js';
import { Sequelize } from 'sequelize'


class ReportService {
    // new instace of service error handler
    #error = new ServiceErrorHandler()

    /**
     * Constructs the ReportService.
     * @param {Invoice: typeof Model} invoiceModel - The Invoice model.
     * @param {InvoiceDetail: typeof Model} [invoiceDetailModel=null] - The InvoiceDetails model.
     * @param {PaymentDetail: typeof Model} [invoicePayDetailModel=null] - The PaymentDetail model.
     */
    constructor(invoiceModel, invoiceDetailModel=null, invoicePayDetailModel=null) {
        this.invoice = invoiceModel
        this.invoiceDetail = invoiceDetailModel,
        this.invoicePayDetail = invoicePayDetailModel
        this.#error
    }
    /**
     * Retrieves the top 10 customers who have spent the most.
     * It calculates the total amount spent by each customer on paid invoices.
     * @returns {Promise<Array<Object>>} A promise that resolves to a formatted list of the top spending customers.
     * Each object contains customer id, name, total_spent, first_purchase date, last_purcahse date, and phone.
     * @throws {ServiceError} If there is an error querying the database.
     */
    getTopSpendingCustomer() {
        return this.#error.handler(['Get best Customers'], async() => {
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
                        association: 'customer', attributes: ['name', 'phone', 'id']
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

    /**
     * Retrieves the top 10 most recurring customers based on the number of paid invoices.
     * @returns {Promise<Array<Object>>} A promise that resolves to a list of the most frequent customers.
     * Each object includes the customer's details and the total number of their invoices.
     * @throws {ServiceError} If there is an error querying the database.
     */
    getTopRecurringCustomer() {
        return this.#error.handler(['Get recurring Customer'], async() => {
            const customers = await this.invoice.findAll({
                where: {
                    status: 'paid'
                },
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('customer_id')), 'total_recurring'],
                    [Sequelize.fn('MIN', Sequelize.col('date')), 'first_invoice'],
                    [Sequelize.fn('MAX', Sequelize.col('date')), 'last_invoice']
                ],
                include:[
                    {
                        association: 'customer', attributes: ['name', 'phone', 'id']
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

    /**
     * Retrieves the top or worst selling products or best selling products based on the total quantity sold.
     * @param {string} [order='DESC'] - The order to sort the results ('DESC' for top, 'ASC' for worst).
     * @returns {Promise<Array<Object>>} A promise that resolves to a list of products.
     * Each object includes the product_id, total_sold, and product details like name and selling_price.
     * @throws {ServiceError} If there is an error querying the database.
     */
    getToSellingProduct(order = 'DESC') {
        return this.#error.handler(['Get Top Selling products'], async() => {
            const products = await this.invoiceDetail.findAll({
                attributes: [
                    'product_id',
                    [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_sold']
                ],
                include:[
                    {
                        association: 'products',
                        attributes: ['name', 'selling_price']
                    },
                    {
                        association: 'invoice',
                        attributes:[],
                        where:{
                            status: 'paid',
                            // date: {
                                // [Sequelize.Op.between]: [startDate, endDate]
                            // }
                        }
                    }
                ],
                group: ['product_id', 'products.id'],
                order: [
                     [[Sequelize.literal('total_sold'), order]]
                ],
                limit: 10
            })

            return products
        })
    }

    /**
     * Retrieves the best or worst selling days within the last 30 days, based on total revenue.
     * @param {string} [order='DESC'] - The order to sort the results ('DESC' for best, 'ASC' for worst).
     * @param {number} [limit=1] - The number of days to return.
     * @returns {Promise<Array<Object>>} A promise that resolves to a list of days.
     * Each object contains the day, the number of sales, and the total revenue.
     * @throws {ServiceError} If there is an error querying the database.
     */
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

    /**
     * Retrieves sales data for each day over the last 30 days.
     * @returns {Promise<Array<Object>>} A promise that resolves to a list of daily sales data, ordered by date.
     * Each object contains the day, the number of sales, and the total revenue.
     * @throws {ServiceError} If there is an error querying the database.
     */
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

    /**
     * Retrieves the top 3 peak sales hours in the last 30 days, based on total revenue.
     * @returns {Promise<Array<Object>>} A promise that resolves to a list of the top 3 sales hours.
     * Each object contains the hour, the number of sales, and the total revenue.
     * @throws {ServiceError} If there is an error querying the database.
     */
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

    /**
     * Retrieves sales performance for each day of the week over the last 30 days.
     * @returns {Promise<Array<Object>>} A promise that resolves to a list of objects, one for each day of the week.
     * Each object contains the day name, total sales count, and total revenue.
     * @throws {ServiceError} If there is an error querying the database.
     */
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

    /**
     * Retrieves a detailed breakdown of total sales per payment method for each day in the last 30 days.
     * @returns {Promise<Array<Object>>} A promise that resolves to a list of daily sales breakdowns.
     * Each object includes the day, payment method details, total amount in the original currency, total in dollars, and transaction count.
     * @throws {ServiceError} If there is an error querying the database.
     */
    dayTotalSales() {
        return this.#error.handler(['Get total sales day'], async() => {
            const today = new Date( )
            const startDate = new Date(today)
            startDate.setDate(today.getDate() - 30)
            startDate.setHours(0, 0, 0, 0)

            const data = await this.invoicePayDetail.findAll({
                attributes:[
                    [Sequelize.fn('DATE', Sequelize.col('invoice.date')), 'day'],
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_currenty'],
                    [Sequelize.fn('SUM', Sequelize.col('reference_amount')), 'total_dollar'],
                    [Sequelize.fn('COUNT', Sequelize.col('invoice.id')), 'transactions']
                ],
                include:[
                    {
                        association: 'payments',
                        attributes: ['name', 'currency']
                    },
                    {
                        association: 'invoice',
                        attributes: [],
                        where:{
                            status: 'paid',
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
                    'payment_id', 
                    'payments.id'
                ],
                order: [
                    [[Sequelize.literal('day'), 'DESC']]
                ]

            })
            
            return data
        })
    }

    /**
     * Retrieves the last 4 paid invoices from the last 7 days.
     * @returns {Promise<Array<Object>>} A promise that resolves to a list of recent invoice objects.
     * Each object includes invoice id, date, total, and associated seller and customer names.
     * @throws {ServiceError} If there is an error querying the database.
     */
    getInvoicePerDate() {
        return this.#error.handler(['Read Invoices Per Date'], async() => {
            const today = new Date()
            const startDate = new Date(today)
            startDate.setDate(today.getDate() - 7)
            startDate.setHours(0, 0, 0, 0)

            const data = await this.invoice.findAll({
                attributes: [
                    'id',
                    'date',
                    'total',
                ],
                include: [
                    {
                        association: 'seller', 
                        attributes: ['name']
                    },
                    {
                        association: 'customer',
                        attributes: ['name', 'phone']
                    }
                ],
                where:{
                    status: 'paid',
                    date: {
                        [Sequelize.Op.between]: [startDate, today]
                    }
                },
                order:[['date', 'DESC']],
                limit: 4
            })

            return data
        })
    }

    /**
     * Performs a cash closing for a specific seller for the current day.
     * It aggregates sales data by payment method for all paid invoices from that seller today.
     * @param {number} seller_id - The ID of the seller to perform the cash closing for.
     * @returns {Promise<Array<Object>>} A promise that resolves to a list of payment summaries for the seller's daily sales.
     * @throws {ServiceError} If there is an error querying the database.
     */
    cashClosing(seller_id) {
         return this.#error.handler(['Get total sales day'], async() => {
            const today = new Date()
            const data = await this.invoicePayDetail.findAll({
                attributes:[
                    [Sequelize.fn('DATE', Sequelize.col('invoice.date')), 'day'],
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_currenty'],
                    [Sequelize.fn('SUM', Sequelize.col('reference_amount')), 'total_dollar'],
                    [Sequelize.fn('COUNT', Sequelize.col('invoice.id')), 'transactions']
                ],
                include:[
                    {
                        association: 'payments',
                        attributes: ['name', 'currency']
                    },
                    {
                        association: 'invoice',
                        attributes: [],
                        where:{
                            status: 'paid',
                            seller_id: seller_id,
                            [Sequelize.Op.and]: Sequelize.where(
                                Sequelize.fn('DATE', Sequelize.col('date')), `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
                            )
                        }
                    }
                ],
                group: [
                    Sequelize.fn('DATE', Sequelize.col('invoice.date')),
                    'payment_id', 
                    'payments.id'
                ],
                order: [
                    [[Sequelize.literal('day'), 'DESC']]
                ]

            })
            
            return data
        })
    }

    /**
     * Calculates the percentage of sales made through each payment method over the last 7 days.
     * It also provides a summary of total sales in dollars and the equivalent in bolivars.
     * @returns {Promise<Array<Object>>} A promise that resolves to a list of payment method statistics,
     * with a final summary object appended.
     * @throws {ServiceError} If there is an error querying the database.
     */
    payMethodPercent() {
        return this.#error.handler(['Get pay method percent'], async() => {
            const today = new Date()
            const startDate = new Date(today)
            startDate.setDate(today.getDate() - 7)
            startDate.setHours(0, 0, 0, 0)

            const data = await this.invoicePayDetail.findAll({
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount'],
                    [Sequelize.fn('SUM', Sequelize.col('reference_amount')), 'total_reference'],
                    [Sequelize.fn('COUNT', Sequelize.col('invoice_id')), 'total_invoices']
                    
                ],
                include: [
                    {
                        association: 'payments',
                        attributes: ['name', 'currency']
                    },
                    {
                        association: 'invoice',
                        attributes: [],
                        where: {
                            status: 'paid',
                            date: {
                                [Sequelize.Op.between]: [startDate, today]
                            }
                        }
                    }
                ], 
                group: ['payment_id', 'payments.id'],
                order: [
                    [[Sequelize.literal('total_reference'), 'DESC']]
                ]
            })
            const totalDollar = data.reduce((accumulator, currentValue) => {
                return accumulator + parseFloat(currentValue.dataValues.total_reference)
            }, 0)
            
            const totalReference = data.reduce((accumulator, currentValue) => {
                let value = 0
                if(parseFloat(currentValue.dataValues.total_reference) != parseFloat(currentValue.dataValues.total_amount)) {
                    value = parseFloat(currentValue.dataValues.total_reference)
                }
                return accumulator + value
            }, 0)

            const percentBolivar = (totalReference * 100 ) / totalDollar
            const percentDollar = 100 - percentBolivar

            const total = {
                total_sold_dollar: totalDollar, 
                total_sold_bolivars: totalReference,
                percent_sold_in_bolivar: `${percentBolivar.toFixed(2)}%`,
                percent_sold_in_dollar: `${percentDollar.toFixed(2)}%`
            }
            data.push(total)
            return data
        })
    }

}

export default ReportService
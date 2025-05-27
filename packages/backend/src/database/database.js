import 'dotenv/config' 
import process from 'process'
import { Sequelize } from 'sequelize'
import { initializeUser } from '../models/UserModel.js'
import { initializeCustomer, Customer } from '../models/inventory_models/CustomerModel.js'
import { initializeInvoice, Invoice } from '../models/inventory_models/InvoiceModel.js'

let instance = null

class Database {
    constructor() {
        // if alreday are an instance of sequelize return it 
        // avoid to create a new one. 
        if(instance) {
            return instance
        }
     
        this.sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'postgres',
            logging: false,
            pool: {
                max: 2, 
                min: 0,
                acquire: 3000,
                idle: 10000
            }
        })

        this.testConnection()
        this.initializeModels()
        this.initializeRelations()

        // save instance 
        instance = this
    }

    async testConnection() {
        try{
            await this.sequelize.authenticate()
            console.log('Connection to database has been stablished sucessfully.')
        }catch(error){
            console.error('Unable connect to the database:', error)
        }
    }

    initializeModels() {
        // initialize public models
        initializeUser(this.sequelize)

        // only for test purposes 
        initializeCustomer(this.sequelize)
        initializeInvoice(this.sequelize)
    }

    initializeRelations() {
        Customer.associate({Invoice})
        Invoice.associate({Customer})
    }
}

export default Database
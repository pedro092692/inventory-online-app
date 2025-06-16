import "dotenv/config"
import process from "process"
import { Sequelize } from "sequelize"
import { initializeUser } from "../models/UserModel.js"
import { initializeRole } from "../models/RoleModel.js"
import { initializeCustomer, Customer } from "../models/inventory_models/CustomerModel.js"
import { initializeInvoice, Invoice } from "../models/inventory_models/InvoiceModel.js"
import { initializeInvoiceDetail, InvoiceDetail } from "../models/inventory_models/InvoiceDetailModel.js"
import { initializeSeller, Seller } from "../models/inventory_models/SellerModel.js"
import { initializeProduct, Product } from "../models/inventory_models/ProductModel.js"
import { initializePayment, Payment } from "../models/inventory_models/PaymentModel.js"
import { initializePaymentDetail, PaymentDetail } from "../models/inventory_models/PaymentDetailModel.js" 

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
        initializeRole(this.sequelize)

        // only for test purposes 
        initializeCustomer(this.sequelize)
        initializeInvoice(this.sequelize)        
        initializeInvoiceDetail(this.sequelize)
        initializeSeller(this.sequelize)
        initializeProduct(this.sequelize)
        initializePayment(this.sequelize)
        initializePaymentDetail(this.sequelize)
    
    }

    initializeRelations() {
        Customer.associate({Invoice})
        Invoice.associate({Customer})
        Invoice.associateDetail({InvoiceDetail})
        Invoice.associationSeller({Seller})
        Invoice.associationProducts({Product})
        Invoice.associatePayments({Payment})
        Invoice.associatePaymentDetail({PaymentDetail})
        InvoiceDetail.associationInvoice({Invoice})
        InvoiceDetail.associationProducts({Product})
        Seller.associationSales({Invoice})
        Product.associationInvoiceDetails({Invoice})
        Payment.associationPaymentDetail({Invoice})
        PaymentDetail.associationInvoice({Invoice})
        PaymentDetail.associationPaymentMethod({Payment})

    }
}

export default Database
import pkg from '../config/config.js'
import process from 'process'
import { Sequelize } from 'sequelize'
import { initializeUser, User } from '../models/UserModel.js'
import { initializeRole, Role } from '../models/RoleModel.js'
import { initializeCustomer, Customer } from '../models/inventory_models/CustomerModel.js'
import { initializeInvoice, Invoice } from '../models/inventory_models/InvoiceModel.js'
import { initializeInvoiceDetail, InvoiceDetail } from '../models/inventory_models/InvoiceDetailModel.js'
import { initializeSeller, Seller } from '../models/inventory_models/SellerModel.js'
import { initializeProduct, Product } from '../models/inventory_models/ProductModel.js'
import { initializePayment, Payment } from '../models/inventory_models/PaymentModel.js'
import { initializePaymentDetail, PaymentDetail } from '../models/inventory_models/PaymentDetailModel.js' 
import { initializeDollar } from '../models/inventory_models/DollarModel.js'

const currentEnv = process.env.NODE_ENV || 'development'
const {username, password, database, host, port, dialect} = pkg[currentEnv]


let instance = null

class Database {
    constructor() {
        // if already are an instance of sequelize return it 
        // avoid to create a new one. 
        if(instance) {
            return instance
        }
     
        this.sequelize = new Sequelize(database, username, password, {
            host: host,
            port: port,
            dialect: dialect,
            logging: false,
            pool: {
                max: 2, 
                min: 0,
                acquire: 3000,
                idle: 10000
            }
        })

        // save connection for tenant
        this.tenantRegister = new Map()

        // save instance 
        instance = this

        this.testConnection()
        this.initializeModels()
        this.initializeRelations()

        
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
        initializeDollar(this.sequelize)
    
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

        // admin
        User.associationRole({Role})
        Role.associationUser({User})
    }
}

export default Database
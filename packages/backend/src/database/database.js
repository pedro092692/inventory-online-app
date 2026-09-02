import pkg from '../config/config.js'
import process from 'process'
import { Sequelize } from 'sequelize'
import { initializeUser, User } from '../models/UserModel.js'
import { initializeRole, Role } from '../models/RoleModel.js'
import { initializeStore, Store } from '../models/StoreModel.js'
import { initializePlatformExchangeRate, PlatFormExchangeRate } from '../models/PlatformExchangeRateModel.js'
import { initializeSubscriptionPayment, SubscriptionPayment } from '../models/SubscriptionPaymentModel.js'
import TenantConnection from './tenant_connection.js'

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
            // This ONE pool is shared by the public schema AND every tenant schema (see
            // TenantConnection, which used to open a separate connection pool per tenant —
            // that grew without bound as the number of active stores grew). DB_POOL_MAX lets
            // this be tuned to whatever your Postgres plan's connection limit allows; 10 is a
            // reasonable default for a small deployment. `acquire` (how long a query waits for
            // a free connection before failing) is bumped from the previous 3s to Sequelize's
            // own default of 30s, since a few requests briefly queuing for a connection under
            // load is normal and shouldn't error out that fast.
            pool: {
                max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
                min: 0,
                acquire: 30000,
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

        this.tenant = new TenantConnection(this.sequelize)

        // this.transaction = this.sequelize.transaction.bind(this.sequelize)
        
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
        initializeStore(this.sequelize)
        initializePlatformExchangeRate(this.sequelize)
        initializeSubscriptionPayment(this.sequelize)

    }

    initializeRelations() {
        // Public models relations
        User.associationRole({Role})
        Role.associationUser({User})
        User.associationStore({Store})
        Store.associationOwner({User})
        SubscriptionPayment.associationOwner({User})
        SubscriptionPayment.associationReviewer({User})
    }

    // get all tenants 
    async getTenants() {
        const schemas = await this.sequelize.getQueryInterface().showAllSchemas()
        return schemas
    }
}
const db = new Database()
const sequelize = db.sequelize
const associations = await db.tenant.initializeTenantAssociations

export {associations, sequelize}

export default Database
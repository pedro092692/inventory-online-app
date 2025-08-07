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
import { Umzug, SequelizeStorage } from 'umzug'
import { fileURLToPath, pathToFileURL } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Corregimos la ruta para que sea compatible con cualquier sistema operativo
const migrationsGlobPath = path.join(__dirname, '..', 'migrations', 'tenant_migrations', '*.js').replace(/\\/g, '/')
console.log(migrationsGlobPath)







const currentEnv = process.env.NODE_ENV || 'development'
const {username, password, database, host, port, dialect, db_user_tenant} = pkg[currentEnv]


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
    
    }

    initializeRelations() {
        // Public models relations
        User.associationRole({Role})
        Role.associationUser({User})
    }

    // ** TENANTS ** \\

    async tenantConnection(tenant_id) {
        // set schema
        const schema = `${db_user_tenant}_${tenant_id}`

        // Si la conexión para el tenant ya existe en nuestro registro, la retornamos.
        if(this.tenantRegister.has(tenant_id)) {
            console.log(`Connection for tenant ${tenant_id} already exists.`)
            return this.tenantRegister.get(tenant_id)
        }

        // create new schema for tenant if it not exist
        await this.sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`)

        // create new connection for the tenant 
        const tenantSequelize = new Sequelize(database, username, password, {
            host: host,
            port: port,
            dialect: dialect,
            logging: false,
            pool: {
                max: 7,
                min: 0,
                acquire: 3000,
                idle: 10000
            },
            // Establecemos el schema por defecto para esta conexión
            schema: schema
        })
        
        // initialize the models for the tenant
        const models = this.initializeTenantModels(tenantSequelize, schema)

        //execute migrations for the tenant on create schema
        await this.executeTenantMigration(schema, tenantSequelize)

        // initialize tenant model relations
        this.initializeTenantAssociations()

        //save connection for the tenant 
        this.tenantRegister.set(tenant_id, {
            sequelize: tenantSequelize, // Guardamos la instancia correcta de sequelize para el tenant
            models: models
        })
        
        return this.tenantRegister.get(tenant_id)
    }

    // models for tenants 
    initializeTenantModels(sequelize, schema) {
        console.log('initialize tenant models')
        const Customer = initializeCustomer(sequelize, schema)
        const Invoice = initializeInvoice(sequelize, schema)
        return {Customer, Invoice}
    }

    // initialize tenant model relations
    initializeTenantAssociations() {
        Customer.associate({Invoice})
    }

    //get tenant models
    getTenantModels(tenant_id) {
        const tenant = this.tenantRegister.get(tenant_id)
        if(!tenant) {
            throw new Error(`Tenant ${tenant_id} not found`)
        }

        return tenant.models
    }

    // ejecute migration for tenant
    async executeTenantMigration(schema, sequelize) {
       // queryInterface for migration 
    const queryInterface = sequelize.getQueryInterface()
    // umzug instance 
    const umzug = new Umzug({
        migrations: {
            glob: migrationsGlobPath,
            resolve: ({ name, path, context }) => {
                return {
                    name,
                    up: async () => {
                        const migrationPath = pathToFileURL(path)
                        const migration = (await import(migrationPath)).default
                        migration.up(context.queryInterface, Sequelize, context.schema)
                    }
                }
            }
        },
        context: {
            sequelize,
            queryInterface,
            schema: schema
        },
        logger: console,
        storage: new SequelizeStorage({
            sequelize,
            tableName: 'SequelizeMeta',
            schema: schema
        })
    })

    const new_migrations = await umzug.pending()
    console.log(new_migrations)
    if(new_migrations.length > 0) {
        await umzug.up() // execute migrations
    }

    console.log('Migrations were executed successfully.')
    
    }

    // get all tenants 
    async getTenants() {
        const schemas = await this.sequelize.getQueryInterface().showAllSchemas()
        return schemas
    }
}

export default Database
import pkg from '../config/config.js'
import process from 'process'
import { Sequelize } from 'sequelize'
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

// path for migration and seeder.
const migrationsGlobPath = path.join(__dirname, '..', 'migrations', 'tenant_migrations', '*.js').replace(/\\/g, '/')
const seedersGloPath = path.join(__dirname, '..', 'seeders', '20250616062547-seed-payment-methods.js').replace(/\\/g, '/')

const currentEnv = process.env.NODE_ENV || 'development'
const {username, password, database, host, port, dialect, db_user_tenant} = pkg[currentEnv]


class TenantConnection {

    constructor(sequelize) {

        // sequelize instance 
        this.sequelize = sequelize

        // save connection for tenant
        this.tenantRegister = new Map()

    }

    /**
     * Creates a new sequelize instance
     * @returns {Obeject} - The sequelize instace 
     */
    newSequelizeInstance() {
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
            } 
        })
        return tenantSequelize
    }
   

    /**
     * Creates new schema if it not exist in the dababase.
     * @param {string} schema -The name of the schema to be create.
     * @returns {Promise<void>} A promise that resolves in the new schema.
     */
    async createNewShema(schema) {
        await this.sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`)
    }


    /**
     * Establishes and initializes a Sequelize connection for a specific tenant.
     *
     * This method:
     * 1. Builds a tenant-specific schema name.
     * 2. Creates the schema if it does not already exist.
     * 3. Checks if the tenant is already registered and returns it if so.
     * 4. Creates a new Sequelize instance for the tenant.
     * 5. Initializes models and their associations for the tenant.
     * 6. Saves the tenant's connection and models in the registry.
     * 7. Executes pending migrations and seeders for the tenant's schema.
     *
     * @async
     * @param {string} tenant_id - The unique identifier of the tenant.
     * @returns {Promise<{sequelize: import('sequelize').Sequelize, models: Object.<string, import('sequelize').Model>}>}
     * An object containing the Sequelize instance and models for the tenant.
     *
     * @example
     * const tenantData = await TenantConnection('tenant123');
     * 
     */
    async TenantConnection(tenant_id) {
        // set schema
        const schema = `${db_user_tenant}_${tenant_id}`

        // create new schema for tenant if it not exist
        this.createNewShema(schema)
        

        // checks if tenant is alreay registered 
        const tenant = this.isTenantRegistered(tenant_id, schema)
        if(tenant) {
            return tenant
        }

        // if tenant if not register create new sequelize instance
        const tenantSequelize = this.newSequelizeInstance()

        // initializes model 
        const models = await this.initializeTenantModels(tenantSequelize, schema)

        // initializes tenant model relations
        await this.initializeTenantAssociations()

        // save data for tenant
        this._saveTenantData(tenant_id, models)

        // execute migrations for the new schema 
        await this.newMigration(schema, tenantSequelize)

        // execute default seeder for payment mehtod
        await this .newMigration(schema, tenantSequelize, seedersGloPath)

        // return tenant data
        return this.tenantRegister.get(tenant_id)
    }
    
    /**
     * Checks if a tenant is already registered and initializes its models and associations if found.
     *
     * @param {string} tenant_id - The unique identifier of the tenant.
     * @param {string} schema - The database schema associated with the tenant.
     * @returns {object|undefined} The tenant object if registered, otherwise `undefined`.
     */
    isTenantRegistered(tenant_id, schema) {
        if(this.tenantRegister.has(tenant_id)) {
            const tenant = this.tenantRegister.get(tenant_id)
            
            // initialize models for tenant 
            this.initializeTenantModels(tenant.sequelize, schema)
            // initialize relations for tenant
            this.initializeTenantAssociations()
            return tenant
        }
    }


    /**
     * Initializes all Sequelize models for a specific tenant and schema.
     *
     * This method sets up the models for the given tenant using the provided Sequelize instance
     * and schema name. It returns an object containing all initialized models, ready for use
     * in associations and queries.
     *
     * @async
     * @param {object} sequelize - The Sequelize instance configured for the tenant.
     * @param {string} schema - The name of the database schema associated with the tenant.
     * @returns {Promise<object>} An object containing all initialized Sequelize models:
     *  - Customer
     *  - Invoice
     *  - InvoiceDetail
     *  - Seller
     *  - Product
     *  - Payment
     *  - PaymentDetail
     *  - Dollar
     */
    async initializeTenantModels(sequelize, schema) {
        const Customer = initializeCustomer(sequelize, schema)
        const Invoice = initializeInvoice(sequelize, schema)
        const InvoiceDetail = initializeInvoiceDetail(sequelize, schema)
        const Seller = initializeSeller(sequelize, schema)
        const Product = initializeProduct(sequelize, schema)
        const Payment = initializePayment(sequelize, schema)
        const PaymentDetail = initializePaymentDetail(sequelize, schema)
        const Dollar = initializeDollar(sequelize, schema)
        return {
            Customer, 
            Invoice, 
            InvoiceDetail, 
            Seller, 
            Product, 
            Payment, 
            PaymentDetail, 
            Dollar
        }
    }


    /**
     * Initializes model associations for the tenant's Sequelize models.
     *
     * This method sets up all the necessary relationships between models such as
     * `Customer`, `Invoice`, `InvoiceDetail`, `Seller`, `Product`, `Payment`, and `PaymentDetail`.
     * It ensures that Sequelize understands how these models are connected, enabling
     * features like eager loading and referential integrity.
     *
     * @async
     * @returns {Promise<void>} Resolves when all associations are initialized.
     */
    async initializeTenantAssociations() {
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
    
    
    
    /**
     * Stores Sequelize connection and model references for a specific tenant.
     *
     * This method saves tenant-specific data in the internal `tenantRegister` map,
     * allowing later retrieval of the Sequelize instance and associated models for
     * that tenant.
     *
     * @private
     * @param {string} tenant_id - The unique identifier of the tenant.
     * @param {Object.<string, import('sequelize').Model>} models - An object mapping model names to Sequelize model instances.
     * @returns {void} This method does not return a value.
     *
     */
    _saveTenantData(tenant_id, models) {
        this.tenantRegister.set(tenant_id, {
            sequelize: this.sequelize,
            models: models
        })
    }

    /**
     * Runs any pending database migrations for the given schema.
     *
     * This method creates an Umzug instance (via {@link newUmzug}), checks for pending
     * migrations, and executes them if any are found. Migrations are located using
     * the provided `glop_path` glob pattern.
     *
     * @async
     * @param {string} schema - The database schema to run migrations against.
     * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance for database connection.
     * @param {string} [glop_path=migrationsGlobPath] - The glob pattern to locate migration files.
     * @returns {Promise<void>} Resolves when all pending migrations (if any) have been executed.
     *
     * @example
     * await newMigration('public', sequelize);
     * // Logs: "Migrations were executed successfully."
     */
    async newMigration(schema, sequelize, glop_path=migrationsGlobPath) {
        // queryInterface for migration 
        const queryInterface = sequelize.getQueryInterface()
        // create umzug instance 
        const umzug = await this.newUmzug(schema, sequelize, queryInterface, glop_path)
        const new_migrations = await umzug.pending()
        if(new_migrations.length > 0) {
            await umzug.up() // execute migrations
        }
        console.log('Migrations were executed successfully.')

    }

    /**
     * Creates and configures a new Umzug migration instance for a specific schema.
     *
     * This method sets up Umzug to run migrations located at the given `glop_path`.
     * Each migration is dynamically imported and executed in the context of the provided
     * Sequelize instance, query interface, and schema.
     *
     * @async
     * @param {string} schema - The database schema to run migrations against.
     * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance for database connection.
     * @param {import('sequelize').QueryInterface} queryInterface - The Sequelize query interface.
     * @param {string} [glop_path=migrationsGlobPath] - The glob pattern to locate migration files.
     * @returns {Promise<import('umzug').Umzug>} A configured Umzug instance ready to execute migrations.
     */
    async newUmzug(schema, sequelize, queryInterface, glop_path=migrationsGlobPath) {
        const umzug = new Umzug({
            migrations: {
                glob: glop_path,
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

        return umzug
    }
}



export default TenantConnection
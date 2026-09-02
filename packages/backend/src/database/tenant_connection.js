import pkg from '../config/config.js'
import process from 'process'
import { Sequelize } from 'sequelize'
import { initializeCustomer } from '../models/inventory_models/CustomerModel.js'
import { initializeInvoice } from '../models/inventory_models/InvoiceModel.js'
import { initializeInvoiceDetail } from '../models/inventory_models/InvoiceDetailModel.js'
import { initializeSeller } from '../models/inventory_models/SellerModel.js'
import { initializeProduct } from '../models/inventory_models/ProductModel.js'
import { initializePayment } from '../models/inventory_models/PaymentModel.js'
import { initializePaymentDetail } from '../models/inventory_models/PaymentDetailModel.js'
import { initializeDollar } from '../models/inventory_models/DollarModel.js'
import { initializeAuditLog } from '../models/inventory_models/auditLogModel.js'
import { initializeCustomerCredit } from '../models/inventory_models/customerCreditModel.js'
import { initializeInvoiceReturn } from '../models/inventory_models/InvoiceReturnModel.js'
import { initializeCashMovements } from '../models/inventory_models/cash_movements.js'
import { initializeStoreSettings } from '../models/inventory_models/StoreSettingsModel.js'
import { User } from '../models/UserModel.js'
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

        // sequelize instance — SHARED by every tenant (see TenantConnection() below for why).
        this.sequelize = sequelize

        // save connection for tenant
        this.tenantRegister = new Map()

        // in-flight setup promises for tenants that are being registered for the first time
        // (schema creation + migrations). Two concurrent requests for the same brand-new
        // tenant would otherwise both pass the "not registered yet" check and race to create
        // the schema and run migrations at the same time; keeping the promise here means the
        // second request just awaits the first one's result instead of duplicating the work.
        this.pendingTenants = new Map()
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
     * Establishes and initializes the tenant's models for a specific tenant/schema, reusing
     * the app's single shared Sequelize connection/pool.
     *
     * This method:
     * 1. Builds a tenant-specific schema name.
     * 2. Returns the tenant's already-registered models if this process has seen it before.
     * 3. Otherwise, creates the schema if needed, initializes the tenant's models and
     *    associations, runs any pending migrations/seeders for that schema, and caches the
     *    result — guarded against concurrent duplicate setup for the same brand-new tenant.
     *
     * IMPORTANT — this used to create a brand-new `Sequelize` instance (its own connection
     * pool) per tenant, and every model class was a single module-level object shared by all
     * tenants. Both of those were bugs in a schema-per-tenant app: connections grew without
     * bound as the number of active stores grew (a `pool.max` per tenant × every tenant, held
     * forever), and — more seriously — since `Model.init()` mutates the class it's called on,
     * a second tenant logging in would silently re-point the FIRST tenant's already-in-use
     * model classes at the second tenant's schema, risking cross-tenant data leaks under
     * concurrent traffic. Postgres schemas are just a query-time namespace, not a separate
     * connection, so one shared connection can safely serve every tenant as long as each
     * tenant has its own model classes (see CustomerModel.js and friends, which now define
     * their class inside the `initialize*` function instead of at module scope) bound to that
     * tenant's schema.
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
        let schema = `${db_user_tenant}_${tenant_id}`
        if(tenant_id === 1) { // test purpose.
            schema = 'test_schema'
        }

        // already registered in this process — nothing else to do.
        const tenant = this.isTenantRegistered(tenant_id)
        if(tenant) {
            return tenant
        }

        // a setup for this tenant is already in flight (a concurrent request got here first)
        // — await that instead of starting a second one.
        if(this.pendingTenants.has(tenant_id)) {
            return this.pendingTenants.get(tenant_id)
        }

        const setupPromise = this._registerTenant(tenant_id, schema).finally(() => {
            this.pendingTenants.delete(tenant_id)
        })
        this.pendingTenants.set(tenant_id, setupPromise)

        return setupPromise
    }

    /**
     * Does the actual first-time setup for a tenant: creates its schema if needed,
     * initializes its models/associations, caches them, and runs pending migrations/seeders.
     * Split out from TenantConnection() so the in-flight promise can be stored before any of
     * this work starts (see the comment there).
     * @param {string} tenant_id
     * @param {string} schema
     * @returns {Promise<{sequelize: import('sequelize').Sequelize, models: Object.<string, import('sequelize').Model>}>}
     */
    async _registerTenant(tenant_id, schema) {
        // create new schema for tenant if it not exist
        await this.createNewShema(schema)

        // initializes model — all tenants share this.sequelize (see class-level comment)
        const models = await this.initializeTenantModels(this.sequelize, schema)

        // initializes tenant model relations for THIS tenant's own model classes
        this.initializeTenantAssociations(models)

        // execute migrations for the new schema
        await this.newMigration(schema, this.sequelize)

        // execute default seeder for payment mehtod
        await this.newMigration(schema, this.sequelize, seedersGloPath)

        // save data for tenant — only AFTER migrations/seeder finish. isTenantRegistered()
        // (checked at the very top of TenantConnection(), before the pendingTenants guard)
        // treats any entry here as "ready to query". Saving it earlier — right after building
        // the model classes, before the tables actually exist — meant a second, concurrent
        // request for this same brand-new tenant could sneak past the pendingTenants guard,
        // see a "registered" tenant, and immediately query a table (e.g. sellers) that this
        // migration run hadn't created yet, throwing "relation ...sellers does not exist".
        this._saveTenantData(tenant_id, models)

        // return tenant data
        return this.tenantRegister.get(tenant_id)
    }

    /**
     * Returns the tenant's cached connection/models if this process has already registered it.
     * @param {string} tenant_id - The unique identifier of the tenant.
     * @returns {object|undefined} The tenant object if registered, otherwise `undefined`.
     */
    isTenantRegistered(tenant_id) {
        return this.tenantRegister.get(tenant_id)
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
     *  - AuditLog
     *  - CustomerCredit
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
        const AuditLog = initializeAuditLog(sequelize, schema)
        const CustomerCredit = initializeCustomerCredit(sequelize, schema)
        const CashMovements = initializeCashMovements(sequelize, schema)
        const InvoiceReturn = initializeInvoiceReturn(sequelize, schema)
        const StoreSettings = initializeStoreSettings(sequelize, schema)

        return {
            Customer,
            Invoice,
            InvoiceDetail,
            Seller,
            Product,
            Payment,
            PaymentDetail,
            Dollar,
            AuditLog,
            CustomerCredit,
            CashMovements,
            InvoiceReturn,
            StoreSettings,
        }
    }


    /**
     * Initializes model associations for one tenant's own Sequelize models.
     *
     * This method sets up all the necessary relationships between models such as
     * `Customer`, `Invoice`, `InvoiceDetail`, `Seller`, `Product`, `Payment`, and `PaymentDetail`.
     * It ensures that Sequelize understands how these models are connected, enabling
     * features like eager loading and referential integrity.
     *
     * IMPORTANT: this takes the tenant's own `models` object (as returned by
     * initializeTenantModels) rather than reaching for the module-level imports — each
     * tenant has its own model classes now, so associations must be wired on THOSE specific
     * classes, not on whichever tenant happened to import these model files first.
     *
     * @param {Object.<string, import('sequelize').Model>} models - this tenant's own initialized models.
     * @returns {void} Resolves when all associations are initialized.
     */
    initializeTenantAssociations(models) {
        const {
            Customer, Invoice, InvoiceDetail, Seller, Product, Payment,
            PaymentDetail, AuditLog, CustomerCredit, CashMovements, InvoiceReturn
        } = models

        Customer.associate({Invoice})
        Customer.associateCredit({CustomerCredit})
        Invoice.associate({Customer})
        Invoice.associateDetail({InvoiceDetail})
        Invoice.associationSeller({Seller})
        Invoice.associationProducts({Product})
        Invoice.associatePayments({Payment})
        Invoice.associatePaymentDetail({PaymentDetail})
        InvoiceDetail.associationInvoice({Invoice})
        InvoiceDetail.associationProducts({Product})
        InvoiceDetail.associationInvoiceReturn({InvoiceReturn})
        Seller.associationSales({Invoice})
        Seller.associationUser({User})
        Product.associationInvoiceDetails({Invoice})
        Payment.associationPaymentDetail({Invoice})
        PaymentDetail.associationInvoice({Invoice})
        PaymentDetail.associationPaymentMethod({Payment})
        AuditLog.associationUser({User})
        AuditLog.associationSupervisorSeller({Seller})
        CustomerCredit.associationCustomer({Customer})
        CustomerCredit.associationOriginInvoice({Invoice})
        CustomerCredit.associationPayment({Payment})
        InvoiceReturn.associationInvoiceDetail({InvoiceDetail})
        InvoiceReturn.associationInvoice({Invoice})
        InvoiceReturn.associationCustomerCredit({CustomerCredit})
        InvoiceReturn.associationUser({User})
        InvoiceReturn.associationSupervisorSeller({Seller})
        CashMovements.associationInvoice({Invoice})
        CashMovements.associationPaymentMehotd({Payment})
        CashMovements.associationUser({User})
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
        const queryInterface = await sequelize.getQueryInterface()
        // create umzug instance
        const umzug = await this.newUmzug(schema, sequelize, queryInterface, glop_path)

        // Sanity check: `umzug.migrations()` lists every migration file the glob pattern
        // resolves to, regardless of whether it has already run. If this comes back empty,
        // the glob itself isn't matching any files (wrong path, an OS-specific glob quirk,
        // the directory doesn't exist, etc.) — NOT "nothing pending". Silently continuing in
        // that case is exactly how a tenant schema ends up created with zero tables: no error
        // is thrown, `new_migrations.length` is just 0, and the caller (_registerTenant) goes
        // on to mark the tenant as ready. Fail loudly instead so this is never silent again.
        const context = await umzug.getContext()
        const allMigrations = await umzug.migrations(context)
        if(allMigrations.length === 0) {
            throw new Error(
                `No migration files matched glob "${glop_path}" for schema "${schema}". ` +
                `Refusing to continue — this tenant would otherwise be created with no tables.`
            )
        }

        const new_migrations = await umzug.pending()
        console.log(`[tenant migrations] schema="${schema}": ${allMigrations.length} file(s) found, ${new_migrations.length} pending.`)
        if(new_migrations.length > 0) {
            await umzug.up() // execute migrations
            console.log(`[tenant migrations] schema="${schema}": applied ${new_migrations.length} migration(s).`)
        }

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
                            const migration = await (await import(migrationPath)).default
                            await migration.up(context.queryInterface, Sequelize, context.schema)
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
                // IMPORTANT: SequelizeStorage registers its tracking model on the shared
                // `sequelize` instance under the name `modelName` (default: 'SequelizeMeta').
                // Internally it does `sequelize.isDefined(modelName) ? sequelize.model(modelName)
                // : sequelize.define(modelName, ..., {schema})` — Sequelize caches defined
                // models by NAME on the instance, not by schema. Since every tenant now shares
                // ONE `sequelize` instance, the very first tenant to run migrations (e.g.
                // test_schema) permanently "claims" the name 'SequelizeMeta': every later
                // tenant's SequelizeStorage sees `isDefined('SequelizeMeta') === true` and
                // silently reuses THAT FIRST tenant's model — meaning it reads/writes the
                // first tenant's schema's meta table no matter what `schema` is passed here.
                // The result: `pending()` for a brand-new tenant checks whether ITS migrations
                // are in the FIRST tenant's already-fully-migrated meta table, finds them all
                // "done", and returns 0 pending — so no table ever actually gets created, with
                // no error. Giving each schema its own modelName avoids the name collision;
                // the physical table name/columns (tableName: 'SequelizeMeta', inside this
                // tenant's own `schema`) stay exactly the same as before.
                modelName: `SequelizeMeta_${schema}`,
                tableName: 'SequelizeMeta',
                schema: schema
            })
        })

        return umzug
    }
}

export default TenantConnection

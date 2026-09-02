import { DataTypes, Model } from 'sequelize'

/**
 * Initializes the Customer model with its schema definition and configuration.
 * This function sets up the Customer model with fields such as `id`, `id_number`, `name`, and `phone`,
 * and configures Sequelize options like table name, schema, and timestamps.
 *
 * IMPORTANT: the `Customer` class is defined INSIDE this function on purpose, so every call
 * returns a brand-new class bound to its own `sequelize`/`schema`. This is a multi-tenant app —
 * each tenant has its own Postgres schema — and this function used to `.init()` a single
 * module-level class shared by every tenant. That meant logging in as tenant B would silently
 * re-point tenant A's already-in-use `Customer` model at tenant B's schema (since `Model.init`
 * mutates the class itself), risking one store's requests reading or writing another store's
 * data under concurrent traffic. Defining the class here keeps every tenant's model completely
 * isolated. See TenantConnection for how these per-tenant classes are created and cached.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance used to initialize the model.
 * @param {string} schema - The schame used to register the model.
 * @return {Customer: typeof model} returns customer model.
 */
function initializeCustomer(sequelize, schema) {
    class Customer extends Model {

        /**
         * Creates an association between the Customer model and the Invoice model.
         * @param {{ Invoice: typeof Model }} model - An object containing the Invoice model class.
         * @returns {void} This method does not return a value.
         */
        static associate(model) {
            this.hasMany(model.Invoice, {
                foreignKey: 'customer_id',
                as: 'invoices'
            })
        }

        /**
         * Creates an association between the Customer model and the Customer Credit model.
         * @param {{ CreditCustomer: typeof Model }} model - An object containing the Invoice Credit model class.
         * @returns {void} This method does not return a value.
         */
        static associateCredit(model) {
            this.hasMany(model.CustomerCredit, {
                foreignKey: 'customer_id',
                as: 'credits'
            })
        }
    }

    Customer.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            id_number: {
                type: DataTypes.INTEGER, // int for venezuelan id
                allowNull: false,
                validate:{
                    notEmpty:{
                        msg: 'Id number cannot be empty.'
                    }
                }
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty:{
                        msg: 'Customer name cannot be empty.'
                    }
                }
            },

            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Customer',
            tableName: 'customers',
            timestamps: true,
            createdAt: false,
            updatedAt: false,
            paranoid: true,
            deletedAt: 'deletedAt',
            schema: schema
        }
    )
    return Customer
}

export { initializeCustomer }

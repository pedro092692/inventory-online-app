import { DataTypes, Model } from 'sequelize'

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
}

/**
 * Initializes the Customer model with its schema definition and configuration.
 * This function sets up the Customer model with fields such as `id`, `id_number`, `name`, and `phone`,
 * and configures Sequelize options like table name, schema, and timestamps.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance used to initialize the model.
 * @param {string} schema - The schame used to register the model.
 * @return {Customer: typeof model} returns customer model.
 */
function initializeCustomer(sequelize, schema) {
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
            }
        },
        {
            sequelize,
            modelName: 'Customer',
            tableName: 'customers',
            timestamps: false,
            schema: schema
        }
    )
    return Customer
}

export { initializeCustomer, Customer }
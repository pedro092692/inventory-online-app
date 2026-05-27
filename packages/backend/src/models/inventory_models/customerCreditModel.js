import { DataTypes, Model } from 'sequelize'

class CustomerCredit extends Model {

    /**
     * Creates an association between the CustomerCredit model and the Customer model.
     * @param {{Customer: typeof Model}} model - An object containing the Customer model.
     * @returns {void} This method does not return a value.
     */
    static associationCustomer(model) {
        this.belongsTo(model.Customer, {
            foreignKey: 'customer_id',
            as: 'customer'
        })
    }
    /**
     * Creates an association between CustomerCredit model and Payment model.
     * @param {{Payment: typeof Model}} model - An object containing the Payment model
     * @return {void} This method does not return a value. 
     */
    static associationPayment(model) {
        this.belongsTo(model.Payment, {
            foreignKey: 'payment_id',
            as: 'payment'
        })
    }

    /**
     * Creates an association between CustomerCredit model and Invoice model.
     * @param {{Payment: typeof Model}} model - An object containing the Invoice model
     * @return {void} This method does not return a value. 
     */
    static associationOriginInvoice(model) {
        this.belongsTo(model.Invoice, {
            foreignKey: 'origin_invoice_id',
            as: 'origin_invoice'
        })
    }
    
}

/**
 * Initializes the CustomerCredit model with its schema definition and configuration.
 * This function sets up the Customer model with fields such as `id`, `customer_id`, `payment_method_id`, `amount`,
 * `status` and `origin_invoice_id`
 * and configures Sequelize options like table name, schema, and timestamps.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance used to initialize the model.
 * @param {string} schema - The schame used to register the model.
 * @return {Customer: typeof model} returns customer model.
 */
function initializeCustomerCredit(sequelize, schema) {
    CustomerCredit.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true, 
                primaryKey: true
            },

            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'customers',
                    key: 'id'
                }
            },

            payment_method_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'payments',
                    key: 'id'
                }
            },

            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isNumeric: {
                        msg: 'A valid number is required.'
                    }
                }
            },

            status: {
                type: DataTypes.ENUM('active', 'void', 'used'),
                allowNull: false,
                defaultValue: 'active',
            },
            
            origin_invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'invoices',
                    key: 'id'
                }
            }
        },
        {
            sequelize,
            modelName: 'CustomerCredit',
            tableName: 'customer_credits',
            timestamps: true,
            updatedAt: false,
            createdAt: 'created_at',
            schema: schema
        }
    )
    return CustomerCredit
}

export { initializeCustomerCredit, CustomerCredit }
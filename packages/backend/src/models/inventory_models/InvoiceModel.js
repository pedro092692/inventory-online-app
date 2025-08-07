import { DataTypes, Model } from 'sequelize'

class Invoice extends Model {
    // model relations

    /**
     * Creates an association between the Invoice model and the Customer model.
     * @param {{Customer: typeof Model}} model - An object containing the Customer model.
     * @returns {void} This method does not return a value.
     */
    static associate(model) {
        this.belongsTo(model.Customer, {
            foreignKey: 'customer_id',
            as: 'customer'
        })
    }

    /**
     * Creates an association between Invoice model and the InvoiceDetail Model.
     * @param {{InvoiceDetail: typeof Model}} model - An object containing the InvoiceDetail model.
     * @returns {void} This method does not return a value. 
     */
    static associateDetail(model) {
        this.hasMany(model.InvoiceDetail, {
            foreignKey: 'invoice_id',
            as: 'details'
        })
    }

    /**
     * Creates and association between Invoice model and the Product Model through InvoiceDetail mode.
     * @param {{Product: typeof Model}} model - An object containing the Product model.
     * @returns {void} This method does not return a value. 
     */
    static associationProducts(model) {
        this.belongsToMany(model.Product, {
            through: 'invoice_details',
            foreignKey: 'invoice_id',
            timestamps: false,
            as: 'products'
        }) 
    }


    /**
     * Creates an association between Invoice model and the Seller model.
     * @param {{Seller: typeof Model}} model - An object containing the Seller model.
     * @returns {void} This method does not return a value. 
     */
    static associationSeller(model) {
        this.belongsTo(model.Seller, {
            foreignKey: 'seller_id',
            as: 'seller'
        })
    }

    /**
     * Creates an association between Invoice model and the PaymentDetail mode.
     * @param {{PaymentDetail: typeof Model}} model - An object containing the InvoiceDetail model
     * @return {void} This method does not return a value. 
     */
    static associatePaymentDetail(model) {
        this.hasMany(model.PaymentDetail, {
            foreignKey: 'invoice_id',
            as: 'payments-details'
        })
    }

    /**
     * Creates an association between Invoice model the Pyament model through PaymentDetail model.
     * @param {{Payment: typeof Model}} model - An object containing the Payment model
     * @return {void} This method does not return a value. 
     */
    static associatePayments(model) {
        this.belongsToMany(model.Payment, {
            through: 'payment_details',
            foreignKey: 'invoice_id',
            timestamps: false,
            as: 'payments'
        })
    }

}
/**
 * Initializes the Invoice model with its schema definition and configuration.
 * This function sets up the Invoice model with fields such as `id`, `date`, `product_id`, `customer_id`, `seller_id`, `total`, 
 * `total_reference`, `total_paid` and `status`
 * and configures Sequelize options like model name, table name, schema, and timestamps.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance used to initialize the model.
 * @return {Invoice: typeof model} returns invoice model.
 */
function initializeInvoice(sequelize, schema) {
    Invoice.init(
        {
            id: {
                 type: DataTypes.INTEGER,
                 autoIncrement: true,
                 primaryKey: true
             },

            date: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
                allowNull: false,
                validate: {
                    isDate: {
                        msg: 'A valid date is required.'
                    }
                }
            },

            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'customers',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
            },

            seller_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'sellers',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
            },

            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00,
                validate: {
                    isNumeric: {
                        msg: 'A valid number is required.'
                    }
                }
            },

            total_reference: {
                type: DataTypes.DECIMAL(10, 2), 
                allowNull: true,
                defaultValue: 0.00,
                validate: {
                    isNumeric: {
                        msg: 'A valid number is required.'
                    }
                }
            },

            total_paid: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                defaultValue: 0.00,
                validate: {
                    isNumeric: {
                        msg: 'A valid number is required.'
                    }
                }
            },
            status: {
                type: DataTypes.ENUM('paid', 'unpaid'),
                allowNull: false,
                defaultValue: 'unpaid',
            }
        },
        {
            sequelize,
            modelName: 'Invoice',
            tableName: 'invoices',
            timestamps: false,
            schema: schema
        }
    )
    return Invoice
}

export { initializeInvoice, Invoice } 
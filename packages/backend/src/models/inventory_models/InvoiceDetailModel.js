import { DataTypes, Model } from 'sequelize'


class InvoiceDetail extends Model {
    // model ralations

    /**
     * Creates an association between the InvoiceDetail model and the Invoice model.
     * @param {{ Invoice: typeof Model }} model - An object containing the Invoice model class.
     * @returns {void} This method does not return a value.
     */
    static associationInvoice(model) {
        this.belongsTo(model.Invoice, {
            foreignKey: 'invoice_id',
            as: 'invoice'
        })
    }

    /**
     * Creates an association between the InvoiceDetail model and the Product model.
     * @param {{ Product: typeof Model}} model - An object containing the Product model class.
     * @returns {void} This method does not return a value. 
     */
    static associationProducts(model) {
        this.belongsTo(model.Product, {
            foreignKey: 'product_id',
            as: 'products'
        }) 
    }
}

/**
 * Initializes the Invoice model with its schema definition and configuration.
 * This function sets up the Invoice model with fields such as `id`, `invoice_id`, `product_id`, `quantity` and `unit_price`,
 * and configures Sequelize options like table name, schema, and timestamps.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance used to initialize the model.
 * @returns {void} This function does not return a value.
 */
function initializeInvoiceDetail(sequelize) {
    InvoiceDetail.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'invoices',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },

            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'restrict'    
            },

            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    isNumeric: {
                        msg: 'A valid number is required.'
                    }
                }
            },

            unit_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isNumeric: {
                        msg: 'A valid price is required.'
                    }
                }
            }

        },
        {
            sequelize,
            modelName: 'InvoiceDetail',
            tableName: 'invoice_details',
            timestamps: false,
            schema: 'test_schema' // only for test purposes
        }
    )
}

export { initializeInvoiceDetail, InvoiceDetail }
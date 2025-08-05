import { DataTypes, Model } from 'sequelize'

class Product extends Model {
    // model relations

    /**
     * Creates an association between Product model and the Invoice model.
     * @param {{Invoice: typeof Model}} model -An object containing the Invoice model.
     * @return {void} This method does not return a value. 
     */
    static associationInvoiceDetails(model) {
        this.belongsToMany(model.Invoice, {
            through: 'invoice_details',
            foreignKey: 'product_id',
            timestamps: false,
            as: 'invoices'
        })
    }

  
    
}

/**
 * Initializes Product model with its schema definition and configuration.
 * This function set up Product model with filds such as: `id`, `barcpde`, `name`, `purchase_price`, `stock` and `selling_price`.
 * And configure Sequelize options like model name, table name, schema and timestamps.
 * @param {import('seuqelize').Sequelize} sequelize - The Sequelize instance used to initialize the model.
 * @return {void} This function does not return a value.
 */
function initializeProduct(sequelize) {
    Product.init(
        {
            id: {
                type: DataTypes.INTEGER, 
                autoIncrement: true, 
                primaryKey: true
            },

            barcode: {
                type: DataTypes.STRING, 
                allowNull: false, 
                defaultValue: '0000000000001' // default barcode number 
            },

            name: {
                type: DataTypes.STRING, 
                allowNull: false, 
                defaultValue: 'Default product',
            }, 

            purchase_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false, 
                validate: {
                    isNumeric: {
                        msg: 'A valid price is required.'
                    }
                }
            },

            selling_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false, 
                validate: {
                    isNumeric: {
                        msg: 'A valid number is required.'
                    }
                }
            },

            stock: {
                type: DataTypes.INTEGER, 
                allowNull: false, 
                validate: {
                    isNumeric: {
                        msg: 'A valid number is required.'
                    }
                }
            }
        },
        {
            sequelize, 
            modelName: 'Product',
            tableName: 'products',
            timestamps: false,
            schema: 'test_schema' // only for test purposes
        }
    )
}

export { initializeProduct, Product }


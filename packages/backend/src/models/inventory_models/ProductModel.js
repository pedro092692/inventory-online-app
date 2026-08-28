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
 * @param {string} schema - The schame used to register the model.
 * @return {Product: typeof model} returns Product model.
 */
function initializeProduct(sequelize, schema) {
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
                // Not a plain `unique: true` here: it's enforced as a partial unique
                // index scoped to non-deleted rows (see the barcode partial-index
                // migration), so a soft-deleted product's barcode can be reused.
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
            },

            // Threshold used for low-stock alerts on the store dashboard: a product is
            // considered "low stock" once `stock` falls to or below this value. Defaults
            // to 5 (see the migration) so alerts work out of the box; the owner can
            // customize it per product from the add/edit product form.
            min_stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 5,
                validate: {
                    isNumeric: {
                        msg: 'A valid number is required.'
                    }
                }
            },

            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Product',
            tableName: 'products',
            timestamps: true,
            createdAt: false,
            updatedAt: false,
            paranoid: true,
            deletedAt: 'deletedAt',
            schema: schema
        }
    )
    return Product
}

export { initializeProduct, Product }


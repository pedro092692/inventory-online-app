import { DataTypes, Model } from "sequelize"

class Product extends Model {
    // model relations
}

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
                defaultValue: "0000000000001" // default barcode number 
            },

            name: {
                type: DataTypes.STRING, 
                allowNull: false, 
                defaultValue: "Default product",
            }, 

            purchase_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false, 
                validate: {
                    isNumeric: {
                        msg: "A valid price is required."
                    }
                }
            },

            selling_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false, 
                validate: {
                    isNumeric: {
                        msg: "A valid number is required."
                    }
                }
            },

            stock: {
                type: DataTypes.INTEGER, 
                allowNull: false, 
                validate: {
                    isNumeric: {
                        msg: "A valid number is required."
                    }
                }
            }
        },
        {
            sequelize, 
            modelName: "Product",
            tableName: "products",
            timestamps: false,
        }
    )
}

export { initializeProduct, Product }


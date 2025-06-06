import { DataTypes, Model } from "sequelize"

class Seller extends Model {
    // model relations 

    // invoices
    static associationSales(model) {
        this.hasMany(model.Invoice, {
            foreignKey: "seller_id",
            as: "sales"
        })
    }
}

function initializeSeller(sequelize) {
    Seller.init(
        {
            id: {
                 type: DataTypes.INTEGER, 
                 autoIncrement: true,
                 primaryKey: true,
             },
            
            id_number: {
                 type: DataTypes.INTEGER, 
                 allowNull: false,
                 validate: {
                     notEmpty: {
                         msg: "A valid id number is required."
                     }
                 }
             },

            name: {
                 type: DataTypes.STRING, 
                 allowNull: false,
                 validate: {
                     notEmpty: {
                         msg: "A valid name is required."
                     }
                 }
             },

            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "A valid last name is required."
                    }
                }
            },

            address: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Venezuela", // default value for Venezuelan users.
                validate: {
                    notEmpty:{
                        msg: "A valid address is required."
                    }
                }
            },
        },
        {
            sequelize,
            modelName: "Seller",
            tableName: "sellers",
            timestamps: false,
            schema: "test_schema" // only for test purposes
        }
    )
}

export { initializeSeller, Seller }
import { DataTypes, Model } from "sequelize"

class Customer extends Model {
    // model relations
}

function initializeCustomer(sequelize) {
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
                        msg: "Id number cannot be empty."
                    }
                }
            },

            name: {
                type: DataTypes.STRING, 
                allowNull: false,
                validate: {
                    notEmpty:{
                        msg: "Customer name cannot be empty."
                    }
                }
            },

            phone: {
                type: DataTypes.STRING, 
                allowNull: false, 
                defaultValue: "+58424000000", // phone number for venezuela 
                validate: {
                    len: {
                        args: [12],
                        msg: "A valid phone number is required."
                    }
                }
            }
        },
        {
            sequelize,
            modelName: "Customer",
            tableName: "customers",
            timestamps: false
        }
    )
}

export { initializeCustomer, Customer }
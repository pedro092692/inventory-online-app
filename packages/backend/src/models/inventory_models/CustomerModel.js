import { DataTypes, Model } from "sequelize"

class Customer extends Model {
    // model relations
    static associate(model) {
        this.hasMany(model.Invoice, {
            foreignKey: "customer_id",
            as: "invoices"
        })
    }
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
                defaultValue: "+584240000000", // phone number for venezuela 
                validate: {
                    len: {
                        args: [13],
                        msg: "A valid phone number is required."
                    }
                }
            }
        },
        {
            sequelize,
            modelName: "Customer",
            tableName: "customers",
            timestamps: false,
            schema: "test_schema" // only for test purposes
        }
    )
}

export { initializeCustomer, Customer }
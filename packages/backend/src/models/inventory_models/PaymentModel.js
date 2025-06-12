import { DataTypes, Model } from "sequelize"

class Payment extends Model {
    // model realations
}

function initializePayment(sequelize) {
    Payment.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true, 
                primaryKey: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Name cannot be empty."
                    }
                }
            },

            currency: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "A valid currency name is required."
                    }
                }
            }
        },
        {
            sequelize,
            modelName: "Payment",
            tableName: "payments",
            timestamps: false
        }
    )
}

export { initializePayment, Payment }
import { DataTypes, Model } from "sequelize"

class Dollar extends Model {
    // model relations
}

function initializeDollar(sequelize) {
    Dollar.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true, 
                primaryKey: true
            },

            value: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isNumeric: {
                         msg: "A valid number is required."
                    }
                }
            },

            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(),
                validate: {
                    isDate: {
                        msg: "A valid date is required."
                    }
                }
            }
        },
        {
            sequelize,
            modelName: "Dollar",
            tableName: "dollar-value",
            timestamps: false,
            schema: "test_schema" // only for test purposes
        }
    )
}

export { initializeDollar, Dollar }
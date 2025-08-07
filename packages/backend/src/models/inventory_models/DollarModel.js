import { DataTypes, Model } from 'sequelize'

class Dollar extends Model {
    // model relations
}

/**
 * Initializes the Dollar model with its schema definition and configuration.
 * This function sets up the Dollar model with fields such as `id`, `value`, and `date`,
 * and configures Sequelize options like table name, schema, and timestamps.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance used to initialize the model.
 * @param {String} schema - The schame used to register the model.
 * @return {Dollar: typeof model} returns Dollar model.
 */
function initializeDollar(sequelize, schema) {
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
                         msg: 'A valid number is required.'
                    }
                }
            },

            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(),
                validate: {
                    isDate: {
                        msg: 'A valid date is required.'
                    }
                }
            }
        },
        {
            sequelize,
            modelName: 'Dollar',
            tableName: 'dollar-value',
            timestamps: false,
            schema: schema
        }
    )
    return Dollar
}

export { initializeDollar, Dollar }
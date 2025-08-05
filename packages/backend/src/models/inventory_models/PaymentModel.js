import { DataTypes, Model } from 'sequelize'

class Payment extends Model {
    // model realations

    /**
     * Creates an association between Payment model and Invoice model through the PaymentDetail model.
     * @param {{Invoice: typeof Model}} model - An object containing Invoice model. 
     * @return {void} This method does not return a value.
     */
    static associationPaymentDetail(model) {
        this.belongsToMany(model.Invoice, {
            through: 'payment_details',
            foreignKey: 'payment_id',
            timestamps: false,
            as: 'payments'
        })
    }
}


/**
 * Initializes Payment model with its schema definition and configuration.
 * This function set up Payment model with field such as: `id`, `name` and `currency`
 * and Configure Sequelize options like model name, table name schema, and timestamps.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance used to initialize the model.
 * @return {void} This function does not return a value.
 */
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
                        msg: 'Name cannot be empty.'
                    }
                }
            },

            currency: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'A valid currency name is required.'
                    }
                }
            }
        },
        {
            sequelize,
            modelName: 'Payment',
            tableName: 'payments',
            timestamps: false,
            schema: 'test_schema' // only for test purposes
        }
    )
}

export { initializePayment, Payment }
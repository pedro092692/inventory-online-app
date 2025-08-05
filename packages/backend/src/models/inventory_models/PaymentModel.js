import { DataTypes, Model } from 'sequelize'

class Payment extends Model {
    // model realations

    // payments details
    static associationPaymentDetail(model) {
        this.belongsToMany(model.Invoice, {
            through: 'payment_details',
            foreignKey: 'payment_id',
            timestamps: false,
            as: 'payments'
        })
    }
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
import { DataTypes, Model } from 'sequelize'

class PaymentDetail extends Model {
    // model relations

    /**
     * Craetes an association between PaymentDetail model and the invoice model.
     * @param {{Invoice: typeof Model}} model - An object containing Invoice model.
     * @return {void} This method does not return a value.
     */
    static associationInvoice(model) {
        this.belongsTo(model.Invoice, {
             foreignKey: 'invoice_id',
             as: 'invoice'
        })
    }

    /**
     * Creates an association between PaymentDetail model and the Payment model.
     * @param {{Payemnt: typeof Model}} model - An object containing Payment model.
     * @return {void} Thid method does not return a value.
     */
    static associationPaymentMethod(model) {
        this.belongsTo(model.Payment, {
            foreignKey: 'payment_id',
            as: 'payments'
        })
    }
}

/** 
 * Initializes PaymentDetail model with its schema definition and configuration.
 * This function set up the PaymentDetail model with fields such as `id`, `invoice_id`, `payment_id`, `amount` and `reference_amount`
 * and configures Sequelize options like model name, table name, schema, and timestamps.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance used to initialize the model.
 * @param {string} schema - The schame used to register the model.
 * @return {PaymentDetail: typeof model} returns PaymentDetail model.
 */
function initializePaymentDetail(sequelize, schema) {
    PaymentDetail.init(
        {
            id: {
                 type: DataTypes.INTEGER,
                 autoIncrement: true,
                 primaryKey: true
            },

            invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'invoices',
                    key: 'id'
                },

                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            payment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'payments',
                    key: 'id'
                },

                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isNumeric: {
                        msg: 'A valid number is required.'
                    }
                }
            },

            reference_amount: {
                type: DataTypes.DECIMAL(10, 2), 
                allowNull: false, 
                validate: {
                    isNumeric: {
                        msg: 'A valid Number is required.'
                    }
                }
            }
        },
        {
            sequelize,
            modelName: 'PaymentDetail',
            tableName: 'payment_details',
            timestamps: false,
            schema: schema
        }
    )
    return PaymentDetail
}

export { initializePaymentDetail, PaymentDetail}
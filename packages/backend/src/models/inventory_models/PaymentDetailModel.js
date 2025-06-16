import { DataTypes, Model } from "sequelize"

class PaymentDetail extends Model {
    // model relations

    //invoices
    static associationInvoice(model) {
        this.belongsTo(model.Invoice, {
             foreignKey: "invoice_id",
             as: "invoice"
        })
    }

    // payments methods
    static associationPaymentMethod(model) {
        this.belongsTo(model.Payment, {
            foreignKey: "payment_id",
            as: "payments"
        })
    }
}

function initializePaymentDetail(sequelize) {
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
                    model: "invoices",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },

            payment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "payments",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },

            amount: {
                type: DataTypes.DECIMAL(10, 2),
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
            modelName: "PaymentDetail",
            tableName: "payment_details",
            timestamps: false,
            schema: "test_schema" // only for test purposes
        }
    )
}

export { initializePaymentDetail, PaymentDetail}
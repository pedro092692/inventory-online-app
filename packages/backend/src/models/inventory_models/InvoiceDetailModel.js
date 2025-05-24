import { DataTypes, Model } from "sequelize"


class InvoiceDetail extends Model {
    // model ralations
}

function initializeInvoiceDetail(sequelize) {
    InvoiceDetail.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "invoices",
                    key: "id"
                },
                onDelete: "CASCADE"
            },

            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "products",
                    key: "id"
                },
                onUpdate: "CASCADE" 
            },

            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    isNumeric: {
                        msg: "A valid number is required."
                    }
                }
            },

            unit_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isNumeric: {
                        msg: "A valid price is required."
                    }
                }
            }

        },
        {
            sequelize,
            modelName: "InvoiceDetail",
            tableNamme: "InvoiceDetails",
            timestamps: false
        }
    )
}

export { initializeInvoiceDetail, InvoiceDetail }
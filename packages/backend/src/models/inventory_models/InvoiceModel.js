import { DataTypes, Model } from "sequelize"

class Invoice extends Model {
    // model relations

    // customers
    static associate(model) {
        this.belongsTo(model.Customer, {
            foreignKey: "customer_id",
            as: "customer"
        })
    }

    // invoice details
    static associateDetail(model) {
        this.hasMany(model.InvoiceDetail, {
            foreignKey: "invoice_id",
            as: "details"
        })
    }


    // seller 
    static associationSeller(model) {
        this.belongsTo(model.Seller, {
            foreignKey: "seller_id",
            as: "seller"
        })
    }
}

function initializeInvoice(sequelize) {
    Invoice.init(
        {
            id: {
                 type: DataTypes.INTEGER,
                 autoIncrement: true,
                 primaryKey: true
             },

            date: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
                allowNull: false,
                validate: {
                    isDate: {
                        msg: "A valid date is required."
                    }
                }
            },

            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "customers",
                    key: "id"
                },
                onUpdate: "CASCADE",
            },

            seller_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "sellers",
                    key: "id"
                },
                onUpdate: "CASCADE",
            },

            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00,
                validate: {
                    isNumeric: {
                        msg: "A valid number is required."
                    }
                }
            }
        },
        {
            sequelize,
            modelName: "Invoice",
            tableName: "invoices",
            timestamps: false,
            schema: "test_schema" // only for test purposes
        }
    )
}

export { initializeInvoice, Invoice } 
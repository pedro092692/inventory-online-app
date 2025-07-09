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

    // products 
    static associationProducts(model) {
        this.belongsToMany(model.Product, {
            through: "invoice_details",
            foreignKey: "invoice_id",
            timestamps: false,
            as: "products"
        }) 
    }


    // seller 
    static associationSeller(model) {
        this.belongsTo(model.Seller, {
            foreignKey: "seller_id",
            as: "seller"
        })
    }

    // payment details
    static associatePaymentDetail(model) {
        this.hasMany(model.PaymentDetail, {
            foreignKey: "invoice_id",
            as: "payments-details"
        })
    }

    // payments
    static associatePayments(model) {
        this.belongsToMany(model.Payment, {
            through: "payment_details",
            foreignKey: "invoice_id",
            timestamps: false,
            as: "payments"
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
            },

            total_reference: {
                type: DataTypes.DECIMAL(10, 2), 
                allowNull: true,
                defaultValue: 0.00,
                validate: {
                    isNumeric: {
                        msg: "A valid number is required."
                    }
                }
            },

            total_paid: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                defaultValue: 0.00,
                validate: {
                    isNumeric: {
                        msg: "A valid number is required."
                    }
                }
            },
            status: {
                type: DataTypes.ENUM('paid', 'unpaid'),
                allowNull: false,
                defaultValue: 'unpaid',
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
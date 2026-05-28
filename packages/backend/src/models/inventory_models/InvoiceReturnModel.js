import { DataTypes, Model } from 'sequelize'

class InvoiceReturn extends Model {
    // model relations

    /**
     * Creates an association between InvoiceDetail model and the CustomerCredit model.
     * @param {{InvoiceDetail: typeof: Model}} model - An object containing the InvoiceDetail model.model
     * @return {void} Thid method does not return a value.
     */
    static associationInvoiceDetail(model) {
        this.belongsTo(model.InvoiceDetail, {
            foreignKey: 'invoice_detail_id',
            as: 'invoice_detail'
        })
    }

    /**
     * Creates an association between Invoice model and the CustomerCredit model.
     * @param {{Invoice: typeof Model}} model - An object containing the Invoice model.
     * @return {void} This method does not return a value.
     */
    static associationInvoice(model) {
        this.belongsTo(model.Invoice, {
            foreignKey: 'invoice_id',
            as: 'invoice'
        })
    }

    /**
     * Creates an association between User model and the CustomerCredit model.
     * @param {{User: typeof Model}} model - An object containing the User model.
     * @return {void} This method does not return a value.
     */
    static associationCustomerCredit(model) {
        this.belongsTo(model.CustomerCredit, {
            foreignKey: 'customer_credit_id',
            as: 'customer_credit'
        })
    }

     /**
     * Creates an association between User model and the CustomerCredit model.
     * @param {{Seller: typeof Model}} model - An object containing the User model.
     * @return {void} This method does not return a value.
     */
    static associationUser(model) {
        this.belongsTo(model.User, {
            foreignKey: 'user_id',
            as: 'user',
            constraints: false
        })
    }

    /**
     * Creates an association between Seller model and the CustomerCredit model.
     * @param {{Seller: typeof Model}} model - An object containing the Seller model.
     * @return {void} This method does not return a value.
     */
    static associationSupervisorSeller(model) {
        this.belongsTo(model.Seller, {
            foreignKey: 'supervisor_seller_id',
            as: 'supervisorSeller',
            constraints: false,
        })
    }


}

function initializeInvoiceReturn(sequelize, schema) {
    InvoiceReturn.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            
            invoice_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            
            invoice_detail_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'invoice_details',
                    key: 'id'
                }
            },
            
            customer_credit_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'customer_credits',
                    key: 'id'
                }

            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        mgs: 'Quantity must be an integer.',
                        min: {
                            args: 1,
                            msg: 'Quantity must be at least 1.'
                        }
                    }
                }
            },
            amount_returned: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isDecimal: {
                        msg: 'A valid number is required.'
                    }
                }
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            supervisor_seller_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'sellers',
                    key: 'id'
                }
            }
        },
        {
            sequelize,
            modelName: 'InvoiceReturn',
            tableName: 'invoice_returns',
            timestamps: true,
            updatedAt: false,
            createdAt: 'created_at',
            schema: schema
        }
    )

    return InvoiceReturn
}

export { initializeInvoiceReturn, InvoiceReturn }

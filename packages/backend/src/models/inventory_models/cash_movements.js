
import { DataTypes, Model } from 'sequelize'

class CashMovements extends Model {
    // model relations 
    
    /**
     * Creates an association between Invoice model and the CashMovements model.
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
     * Creates an association between Payment model and the CashMovements model.
     * @param {{Payment: typeof Model}} model - An object containing Payment model.
     * @return {void} Thid method does not return a value.
     */
    static associationPaymentMehotd(model) {
        this.belongsTo(model.Payment, {
            foreignKey: 'payment_method_id',
            as: 'payments'
        })
    }

}

/**
 * Initialize CashMovements model with its schema definiton and configuration.
 * This function set up CashMovements model with fields such as: `id`, `invoice_id`, `payment_method_id`, `type`, `amount`, `amount_ref`, 
 * `exchange_rate` and `description`
 * and Configure Sequelize options like model name, table name, schema and timestamps.
 * @param {import('sequelize').Sequelize} sequelize -An Sequelize instance used to initialize the CashMovements model. 
 * @param {string} schema - The schame used to register the model.
 * @return {CashMovements: typeof model} returns CashMovements model.
 */
function initializeCashMovements(sequelize, schema) {
    CashMovements.init(
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
                onDelete: 'CASCADE'
            },

            payment_method_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'payments',
                    key: 'id',
                },
                onDelete: 'CASCADE'
            },

            type: {
                type: DataTypes.ENUM('in', 'out'),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },

            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isNumeric: true
                }
            },

            amount_ref: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isNumeric: true
                }    
            },

            exchange_rate: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isNumeric: true
                }    
            },

            description: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },

            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            sequelize,
            modelName: 'CashMovements',
            tableName: 'cash_movements',
            timestamps: true,
            updatedAt: false,
            createdAt: 'created_at',
            schema: schema
        }
    )

    return CashMovements
}

export { initializeCashMovements, CashMovements} 
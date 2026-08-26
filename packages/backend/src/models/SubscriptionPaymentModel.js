import { DataTypes, Model } from 'sequelize'

class SubscriptionPayment extends Model {
    // model relations

    /**
     * Creates an association between SubscriptionPayment model and the User model (the store owner who submitted it).
     * @param {{User: typeof Model}} model - An object containing the User model.
     * @return {void} This method does not return a value.
     */
    static associationOwner(model) {
        this.belongsTo(model.User, {
            foreignKey: 'tenant_id',
            targetKey: 'id',
            as: 'owner'
        })
    }

    /**
     * Creates an association between SubscriptionPayment model and the User model (the admin who reviewed it).
     * @param {{User: typeof Model}} model - An object containing the User model.
     * @return {void} This method does not return a value.
     */
    static associationReviewer(model) {
        this.belongsTo(model.User, {
            foreignKey: 'reviewed_by',
            targetKey: 'id',
            as: 'reviewer'
        })
    }
}

/**
 * Initializes SubscriptionPayment model with its schema definition and configuration.
 * Represents a store owner's manually-uploaded proof of a subscription payment (bank
 * receipt), pending admin verification before the subscription is renewed.
 * @param {import('sequelize').Sequelize} sequelize
 * @returns {void}
 */
function initializeSubscriptionPayment(sequelize) {
    SubscriptionPayment.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            tenant_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            // Amount (in Bs) the store owner declares they paid, per the receipt.
            amount_declared: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
                validate: {
                    isNumeric: { msg: 'El monto debe ser un número.' }
                }
            },

            // Amount (in Bs) the platform expected at submission time (subscription_price_usd * platform rate),
            // kept for reference so the admin can compare it against what the owner declared.
            amount_expected: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: true
            },

            // Object key of the receipt image in R2 (not the raw file).
            receipt_key: {
                type: DataTypes.STRING,
                allowNull: false
            },

            status: {
                type: DataTypes.ENUM('pending', 'approved', 'rejected'),
                allowNull: false,
                defaultValue: 'pending'
            },

            submitted_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },

            reviewed_at: {
                type: DataTypes.DATE,
                allowNull: true
            },

            reviewed_by: {
                type: DataTypes.INTEGER,
                allowNull: true
            },

            rejection_reason: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'SubscriptionPayment',
            tableName: 'subscription_payments',
            timestamps: false,
            schema: 'public'
        }
    )
}

export { initializeSubscriptionPayment, SubscriptionPayment }

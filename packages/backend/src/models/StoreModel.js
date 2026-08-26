import { DataTypes, Model } from 'sequelize'

class Store extends Model {
    // model relations

    /**
     * Creates an association between Store model and the User model (owner).
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
}

/**
 * Initializes Store model with its schema definition and configuration.
 * @param {import('sequelize').Sequelize} sequelize
 * @returns {void}
 */
function initializeStore(sequelize) {
    Store.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            tenant_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: 'El nombre de la tienda es requerido.' }
                }
            },

            fiscal_id: {
                type: DataTypes.STRING,
                allowNull: true
            },

            address: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: 'La dirección de la tienda es requerida.' }
                }
            },

            phone: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: 'El teléfono de la tienda es requerido.' }
                }
            },

            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },

            subscription_expires_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            blocked_reason: {
                type: DataTypes.STRING,
                allowNull: true
            },

            blocked_at: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Store',
            tableName: 'stores',
            timestamps: false,
            schema: 'public'
        }
    )
}

export { initializeStore, Store }
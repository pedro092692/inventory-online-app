import { DataTypes, Model } from 'sequelize'

/**
 * Initializes the StoreSettings model with its schema definition and configuration.
 *
 * This is a single-row-per-tenant settings table (see StoreSettingsService, which always
 * reads/writes the row with id=1, creating it with defaults on first read). It currently
 * only holds the "tasa colchón" (buffer exchange rate) toggle used by the informational
 * Cotizar/Etiquetas screens — see `applyBufferRate` on the frontend for the math. Real
 * sales/invoices are intentionally never read from here.
 *
 * IMPORTANT: the `StoreSettings` class is defined INSIDE this function on purpose, so every
 * call returns a brand-new class bound to its own `sequelize`/`schema` — see the comment in
 * CustomerModel.js for why a shared, module-level class is unsafe in a schema-per-tenant setup.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance used to initialize the model.
 * @param {String} schema - The schema used to register the model.
 * @return {StoreSettings: typeof model} returns StoreSettings model.
 */
function initializeStoreSettings(sequelize, schema) {
    class StoreSettings extends Model {
        // model relations
    }

    StoreSettings.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            // whether the "tasa colchón" (buffer rate) should be applied on Cotizar/Etiquetas
            buffer_enabled: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },

            // the buffered Bs-per-dollar rate (e.g. 850 while the official rate is 791).
            // nullable: only required/used while buffer_enabled is true.
            buffer_rate: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                validate: {
                    isNumeric: {
                        msg: 'A valid number is required.'
                    }
                }
            },

            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            sequelize,
            modelName: 'StoreSettings',
            tableName: 'store_settings',
            timestamps: false,
            schema: schema
        }
    )
    return StoreSettings
}

export { initializeStoreSettings }

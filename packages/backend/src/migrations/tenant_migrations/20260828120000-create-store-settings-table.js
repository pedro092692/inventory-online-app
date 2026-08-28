/**
 * Sequelize migration (tenant schema) creating the `store_settings` table: a single-row
 * per-tenant settings table. Currently holds only the "tasa colchón" (buffer exchange
 * rate) toggle used by the informational Cotizar/Etiquetas screens.
 *
 * @param {import('sequelize').QueryInterface} queryInterface - The interface for database operations.
 * @param {import('sequelize')} Sequelize - Sequelize library for defining data types.
 * @param {string} schema - The database schema where the table will be created.
 * @returns {Promise<void>}
 */
export default {
  async up (queryInterface, Sequelize, schema) {
    await queryInterface.createTable(
      'store_settings',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },

        buffer_enabled: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },

        buffer_rate: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        },

        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      },
      {
        schema
      }
    )
  },

  async down (queryInterface, Sequelize, schema) {
    await queryInterface.dropTable({
      tableName: 'store_settings',
      schema: schema
    })
  }
};

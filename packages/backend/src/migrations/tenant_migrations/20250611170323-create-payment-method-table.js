/**
 * Sequelize migration to create the `payments` table.
 *
 * This table defines available payment methods or types and includes:
 * - `id`: Auto-incrementing primary key.
 * - `name`: Name of the payment method (e.g., "Credit Card", "Cash"), required and non-empty.
 * - `currency`: Currency used for the payment method (e.g., "USD", "EUR"), required and non-empty.
 *
 * The table is created within the specified schema.
 *
 * @param {import('sequelize').QueryInterface} queryInterface - Interface for database operations.
 * @param {import('sequelize')} Sequelize - Sequelize library for defining data types.
 * @param {string} schema - The database schema where the table will be created.
 * @returns {Promise<void>}
 */

export default {
  async up (queryInterface, Sequelize, schema) {
    queryInterface.createTable(
      'payments',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        
        name: {
          type: Sequelize.STRING,
          allowNull: false, 
          validate: {
            notEmpty: true
          }
        },
        currency: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        }
      },
      {
        schema
      }
    )
  },
  /**
   * Reverts the migration by dropping the `payments` table from the specified schema.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - Interface for database operations.
   * @param {import('sequelize')} Sequelize - Sequelize library.
   * @param {string} schema - The database schema where the table will be dropped.
   * @returns {Promise<void>}
   */

  async down (queryInterface, Sequelize, schema) {
    await queryInterface.dropTable({
      tableName: 'payments',
      schema
    })
  }
};

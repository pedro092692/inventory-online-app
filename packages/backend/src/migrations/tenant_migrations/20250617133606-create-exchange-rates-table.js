/**
 * Sequelize migration to create the `exchange_rates` table.
 *
 * This table stores historical exchange rates for the US dollar and includes:
 * - `id`: Auto-incrementing primary key.
 * - `value`: Exchange rate value, required and numeric.
 * - `date`: Date of the exchange rate, required and must be a valid date.
 *
 * The table is created within the specified schema.
 *
 * @param {import('sequelize').QueryInterface} queryInterface - Interface for database operations.
 * @param {import('sequelize')} Sequelize - Sequelize library for defining data types.
 * @param {string} schema - The database schema where the table will be created.
 * @returns {Promise<void>}
 */

export default {
  async up (queryInterface, Sequelize, schema){
    queryInterface.createTable(
      'exchange_rates',
      {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        value: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          validate: {
              isNumeric: true
          }
        },

        date: {
          type: Sequelize.DATE,
          allowNull: false,
          validate: {
            isDate: true
          }
        }
      },
      {
        schema
      }
    )
  },
  /**
   * Reverts the migration by dropping the `exchange_rates` table from the specified schema.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - Interface for database operations.
   * @param {import('sequelize')} Sequelize - Sequelize library.
   * @param {string} schema - The database schema where the table will be dropped.
   * @returns {Promise<void>}
   */

  async down (queryInterface, Sequelize, schema){
    queryInterface.dropTable({
      tableName: 'exchange_rates',
      schema
    })
  }
};

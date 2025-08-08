import { dollarValues } from '../utils/fakerDollar.js';

  /**
   * Inserts fake exchange ratess data into the `exgange_rates` table within the specified schema.
   *
   * @param {object} queryInterface - Sequelize's query interface for database operations.
   * @param {object} Sequelize - Sequelize library instance (not used directly here).
   * @param {string} schema - The name of the database schema to target.
   * @returns {Promise<void>}
   */
export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: 'exchange rates',
        schema: schema
      },
      dollarValues
    )
  },
  /**
   * Deletes all data from the `exchange_rates` table within the specified schema.
   * Uses `truncate` to remove all rows and reset identity counters.
   *
   * @param {object} queryInterface - Sequelize's query interface for database operations.
   * @param {object} Sequelize - Sequelize library instance (not used directly here).
   * @param {string} schema - The name of the database schema to target.
   * @returns {Promise<void>}
   */
  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: 'exchange rates',
        schema: schema
      },
      null, // this means "no condition" = delete all rows
      {
        truncate: true,
        restartIdentity: true,
        cascade: true
      }
    )
  }
};

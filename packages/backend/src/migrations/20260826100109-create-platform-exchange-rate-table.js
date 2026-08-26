'use strict';
/**
 * Migration: Create and drop the `platform_exchange_rates` table.
 *
 * This migration manages a table used to store exchange rate values
 * applied at the platform level. Each record contains:
 *
 * - `id`: Auto-incrementing primary key.
 * - `value`: Numeric exchange rate value (e.g., USD → local currency).
 * - `date`: Date when the exchange rate was registered.
 *
 * The table is created inside the `public` schema.
 *
 * @type {import('sequelize-cli').Migration}
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      { tableName: 'platform_exchange_rates', schema: 'public' },
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        value: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          validate: { isNumeric: true }
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
          validate: { isDate: true }
        }
      }
    )
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable({ tableName: 'platform_exchange_rates', schema: 'public' })
  }
};
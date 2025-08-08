'use strict';

/**
 * Sequelize migration to create the `roles` table.
 *
 * The table includes:
 * - `id`: Auto-incrementing primary key.
 * - `name`: Role name, required and non-empty.
 *
 * The table is created within the specified schema.
 *
 * @param {import('sequelize').QueryInterface} queryInterface - The interface for database operations.
 * @param {import('sequelize')} Sequelize - Sequelize library for defining data types.
 * @param {string} schema - The database schema where the table will be created.
 * @returns {Promise<void>}
 */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      { tableName: 'roles', schema: 'public' },
      
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
        }

      }
    ) 
  },
  /**
   * Reverts the migration by dropping the `roles` table from the specified schema.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - Interface for database operations.
   * @param {import('sequelize')} Sequelize - Sequelize library.
   * @param {string} schema - The database schema where the table will be dropped.
   * @returns {Promise<void>}
   */
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('roles')
  }
};

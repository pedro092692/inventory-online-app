/**
 * Sequelize migration to create the `customers` table.
 *
 * The table includes:
 * - `id`: Auto-incrementing primary key.
 * - `id_number`: Integer field for Venezuelan ID numbers, required and non-empty.
 * - `name`: Customer's name, required and non-empty.
 * - `phone`: Customer's phone number, required.
 *
 * The table is created within the specified schema.
 *
 * @param {import('sequelize').QueryInterface} queryInterface - The interface for database operations.
 * @param {import('sequelize')} Sequelize - Sequelize library for defining data types.
 * @param {string} schema - The database schema where the table will be created.
 * @returns {Promise<void>}
 */

export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.createTable(
      'customers',
      {
        id: {
           type: Sequelize.INTEGER,
           autoIncrement: true,
           primaryKey: true
         },

         id_number: {
          type: Sequelize.INTEGER, // int for Venezuelan id
          allowNull: false, 
          validate: {
            notEmpty: true
          }
         }, 

         name: {
          type: Sequelize.STRING,
          allowNull: false, 
          validate: {
            notEmpty: true,
          }
         },
         
         phone: {
          type: Sequelize.STRING,
          allowNull: false,
         }
      },
      {
        schema
      }
    )
  },
/**
   * Reverts the migration by dropping the `customers` table from the specified schema.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - The interface for database operations.
   * @param {import('sequelize')} Sequelize - Sequelize library.
   * @param {string} schema - The database schema where the table will be dropped.
   * @returns {Promise<void>}
   */
  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.dropTable({
      tableName: 'customers',
      schema: schema
    })
  }
};

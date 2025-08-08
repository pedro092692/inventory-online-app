'use strict';
/**
 * Sequelize migration to create the `users` table.
 *
 * The table includes:
 * - `id`: Auto-incrementing primary key.
 * - `email`: User's email, required, valid-email and unique.
 * - `password`: Users's password, required non empty and min len of 8 characters.
 * - `role_id`: Foreign key referencing `roles.id`, required. Deletes and updates cascade.
 * - `tenant_id`: The id for user tenant_id, required, number.
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
      { tableName: 'users', schema: 'public' },
      
      {
        
        id:{
          type: Sequelize.INTEGER, 
          autoIncrement: true,
          primaryKey: true
        },

        email:{
          type: Sequelize.STRING,
          allowNull: false,
          validate:{
            isEmail: true
          },
          unique: true
        },

        password:{
          type: Sequelize.STRING,
          allowNull: false,
          validate:{
            len:{
              args: [8]
            }
          }
        },

        role_id:{
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'roles',
            key: 'id'
          }
        },
        tenant_id:{
          type: Sequelize.INTEGER,
          allowNull: true,
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
    await queryInterface.dropTable('users')
  }
};

/**
 * Sequelize migration to create the `sellers` table.
 *
 * The table includes:
 * - `id`: Auto-incrementing primary key.
 * - `user_id`: Optional integer field linking to a user.
 * - `is_supervisor`: Boolean indicating if the seller is a supervisor, defaults to false.
 * - `pin`: Optional string field for a personal identification number.
 * - `id_number`: Integer field for Venezuelan ID numbers, required and non-empty.
 * - `name`: Seller's name, required and non-empty.
 * - `last_name`: Seller's last name, required and non-empty.
 * - `address`: Seller's address info, required.
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
      'sellers',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },

        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },

        is_supervisor: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },

        pin: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        id_number: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },

        last_name: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },

        address: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'Venezuela',
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
   * Reverts the migration by dropping the `sellers` table from the specified schema.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - The interface for database operations.
   * @param {import('sequelize')} Sequelize - Sequelize library.
   * @param {string} schema - The database schema where the table will be dropped.
   * @returns {Promise<void>}
   */
  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.dropTable({
      tableName: 'sellers',
      schema
    })
  }
};

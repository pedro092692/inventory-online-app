/**
 * Sequelize migration to create the `invoices` table.
 *
 * The table includes:
 * - `id`: Auto-incrementing primary key.
 * - `date`: Invoice date, required and must be a valid date.
 * - `customer_id`: Optional foreign key referencing `customers.id`, updates cascade.
 * - `seller_id`: Optional foreign key referencing `sellers.id`, deletes and updates cascade.
 * - `total`: Required total amount of the invoice, numeric with default value 0.00.
 * - `total_reference`: Optional reference total, numeric with default value 0.00.
 * - `total_paid`: Optional amount paid, numeric with default value 0.00.
 * - `status`: Enum field indicating payment status, either `'paid'` or `'unpaid'`, default `'unpaid'`.
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
      'invoices',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },

        date: {
          type: Sequelize.DATE,
          allowNull: false,
          validate: {
            isDate: true
          }
        },

        customer_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'customers',
            key: 'id'
          }, 
          onUpdate: 'CASCADE',
        },

        seller_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'sellers',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },

        total: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.00,
          validate: {
            isNumeric: true
          }
        },

        total_reference: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.00,
          validate: {
            isNumeric: true
          }
        },
        
        total_paid: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.00,
          validate: {
            isNumeric: true
          }
        },

        status: {
          type: Sequelize.ENUM('paid', 'unpaid'),
          allowNull: false,
          defaultValue: 'unpaid',
        }
        
      },
      {
        schema
      }
    )
  },
  /**
   * Reverts the migration by dropping the `invoices` table from the specified schema.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - The interface for database operations.
   * @param {import('sequelize')} Sequelize - Sequelize library.
   * @param {string} schema - The database schema where the table will be dropped.
   * @returns {Promise<void>}
   */

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.dropTable({
      tableName: 'invoices',
      schema
    })
  }
};

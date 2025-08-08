/**
 * Sequelize migration to create the `invoice_details` table.
 *
 * This table stores line items for each invoice and includes:
 * - `id`: Auto-incrementing primary key.
 * - `invoice_id`: Foreign key referencing `invoices.id`, required. Deletes cascade.
 * - `product_id`: Foreign key referencing `products.id`, required. Deletes restricted, updates cascade.
 * - `quantity`: Number of units of the product, required, numeric, default is 1.
 * - `unit_price`: Price per unit, required, numeric.
 *
 * The table is created within the specified schema.
 *
 * @param {import('sequelize').QueryInterface} queryInterface - Interface for database operations.
 * @param {import('sequelize')} Sequelize - Sequelize library for defining data types.
 * @param {string} schema - The database schema where the table will be created.
 * @returns {Promise<void>}
 */

export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.createTable(
      'invoice_details',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },

        invoice_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'invoices',
            key: 'id'
          },
          onDelete: 'CASCADE',
        },

        product_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id'
          },
          onDelete: 'restrict',
          onUpdate: 'CASCADE'
        },

        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
          validate: {
            isNumeric: true
          }
        },

        unit_price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isNumeric: true
          }
        }
      },
      {
        schema
      }
    )
  },
  /**
   * Reverts the migration by dropping the `invoice_details` table from the specified schema.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - Interface for database operations.
   * @param {import('sequelize')} Sequelize - Sequelize library.
   * @param {string} schema - The database schema where the table will be dropped.
   * @returns {Promise<void>}
   */

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.dropTable({
      tableName: 'invoice_details',
      schema
    })
  }
};

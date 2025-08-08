/**
 * Sequelize migration to create the `payment_details` table.
 *
 * This table records individual payments made toward invoices and includes:
 * - `id`: Auto-incrementing primary key.
 * - `invoice_id`: Foreign key referencing `invoices.id`, required. Deletes cascade.
 * - `payment_id`: Foreign key referencing `payments.id`, required. Deletes and updates cascade.
 * - `amount`: Actual amount paid, required and numeric.
 * - `reference_amount`: Reference amount in base currency, required and numeric.
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
      'payment_details',
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
            onDelete: 'CASCADE'
          },

          payment_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'payments',
              key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },

          amount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            validate: {
              isNumeric: true
            }
          },

          reference_amount: {
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
   * Reverts the migration by dropping the `payment_details` table from the specified schema.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - Interface for database operations.
   * @param {import('sequelize')} Sequelize - Sequelize library.
   * @param {string} schema - The database schema where the table will be dropped.
   * @returns {Promise<void>}
   */

  async down (queryInterface, Sequelize, schema) {
    queryInterface.dropTable({
      tableName: 'payment_details',
      schema
    })
  }
};

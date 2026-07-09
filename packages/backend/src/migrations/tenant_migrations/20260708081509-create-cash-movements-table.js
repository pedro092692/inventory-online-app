/**
 * Sequelize migration to create the `cash_movements` table.
 *
 * This table stores audit records related to cash movements generated from invoice operations,
 * including returns, adjustments, or other cash-related actions.
 *
 * Fields:
 * - `id`: Auto-incrementing primary key.
 * - `invoice_id`: References the related invoice.
 * - `payment_method_id`: References the payment method used.
 * - `type`: Indicates whether the movement is an "in" (cash received) or "out" (cash delivered).
 * - `amount`: The amount involved in the movement.
 * - `amount_ref`: The reference amount (used for multi-currency operations).
 * - `exchange_rate`: Exchange rate applied when calculating `amount_ref`.
 * - `description`: Description of the cash movement.
 * - `created_at`: Timestamp of creation.
 *
 * The table is created inside the specified schema.
 *
 * @param {import('sequelize').QueryInterface} queryInterface - Interface for database operations.
 * @param {import('sequelize')} Sequelize - Sequelize library for defining data types.
 * @param {string} schema - The database schema where the table will be created.
 * @returns {Promise<void>}
 */
export default {
  async up (queryInterface, Sequelize, schema){
    queryInterface.createTable(
      'cash_movements',
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

        payment_method_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'payments',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },

        type: {
          type: Sequelize.ENUM('in', 'out'),
          allowNull: false,
        },

        amount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            validate: {
              isNumeric: true
            }
        },

        amount_ref: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },

        exchange_rate: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },

        description: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },

        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      },
      {
        schema
      }
    )
  },
  /**
   * Reverts the migration by dropping the `cash_movements` table from the specified schema.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - Interface for database operations.
   * @param {import('sequelize')} Sequelize - Sequelize library.
   * @param {string} schema - The database schema where the table will be dropped.
   * @returns {Promise<void>}
   */

  async down (queryInterface, Sequelize, schema){
    queryInterface.dropTable({
      tableName: 'cash_movements',
      schema
    })
  }
}

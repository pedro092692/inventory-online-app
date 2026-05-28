/**
 * Sequelize migration to create the `invoice_returns` table.
 *
 * This table stores audit information related to invoice returns.
 * It includes:
 * - `id`: Auto-incrementing primary key.
 * - `invoice_id`: Reference to the original invoice.
 * - `invoice_detail_id`: Reference to the specific returned item.
 * - `customer_credit_id`: References to the credit returned to customer if is required.
 * - `quantity`: Number of items returned.
 * - `amount_returned`: Value total of the item returned.
 * - `user_id`: user who creates this new entery.
 * - `supervisor_seller_id`: Athorized supervisor if is required.
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
      'invoice_returns',
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
          }
        },

        invoice_detail_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'invoice_details',
            key: 'id'
          }
        },

        customer_credit_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'customer_credits',
            key: 'id'
          }
        },

        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            isInt: {
              msg: 'Quantity must be an integer',
              min: {
                args: 1,
                msg: 'Quantity must be at least 1'
              }
            }
          }
        },

        amount_returned: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isDecimal: {
              msg: 'A valid number is required.'
            }
          }
        },

        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        supervisor_seller_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'sellers',
            key: 'id'
          }
        }
      },
      {
        schema
      }
    )
    
  },

    /**
   * Reverts the migration by dropping the `audit_logs` table from the specified schema.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - Interface for database operations.
   * @param {import('sequelize')} Sequelize - Sequelize library.
   * @param {string} schema - The database schema where the table will be dropped.
   * @returns {Promise<void>}
   */
  async down (queryInterface, Sequelize, schema) {
    queryInterface.dropTable({
      tableName: 'invoice_returns',
      schema
    })
  }
}

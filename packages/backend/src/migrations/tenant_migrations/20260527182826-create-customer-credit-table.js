/**
 * Sequelize migration to create the `audit_logs` table.
 *
 * This table stores audit information related to customer payments and invoices.
 * It includes:
 * - `id`: Auto-incrementing primary key.
 * - `customer_id`: Reference to the customer associated with the log entry.
 * - `payment_method_id`: Reference to the payment method used.
 * - `amount`: Amount involved in the transaction.
 * - `status`: Current status of the credit (`active`, `void`, `used`).
 * - `origin_invoice_id`: Reference to the invoice where the credit originated.
 * - `created_at`: Timestamp of when the log entry was created.
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
      'customer_credits',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
                    
        customer_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'customers',
            key: 'id'
          },
          onUpdate: 'CASCADE',
        },
                    
        payment_method_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'payments',
            key: 'id'
          }
        },
        
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isNumeric: true,
            msg: 'A valid number is required.'
          }
        },

        status: {
          type: Sequelize.ENUM('active', 'void', 'used'),
          allowNull: false,
          defaultValue: 'active',
        },

        origin_invoice_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'invoices',
            key: 'id'
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
   * Reverts the migration by dropping the `audit_logs` table from the specified schema.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - Interface for database operations.
   * @param {import('sequelize')} Sequelize - Sequelize library.
   * @param {string} schema - The database schema where the table will be dropped.
   * @returns {Promise<void>}
   */
  async down (queryInterface, Sequelize, schema) {
    queryInterface.dropTable({
      tableName: 'customer_credits',
      schema
    })
  }
}

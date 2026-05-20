
/**
 * Sequelize migration to create the `audit_logs` table.
 *
 * This table stores audit logs for the application and includes:
 * - `id`: Auto-incrementing primary key.
 * - `action`: Type of action performed, required and must be a valid string.
 * - `table_name`: Name of the table affected, required and must be a valid string.
 * - `record_id`: ID of the record affected, required and must be a valid integer.
 * - `old_value`: Previous value of the record, optional and must be a valid JSON.
 * - `new_value`: New value of the record, optional and must be a valid JSON.
 * - `user_id`: ID of the user who performed the action, required and must be a valid integer.
 * - `supervisor_seller_id`: ID of the supervisor seller, optional and must be a valid integer.
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
      'audit_logs',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
                    
        action: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
                msg: 'Action is required.'
            }
          }
        },
                    
        table_name: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
                msg: 'Table name is required.'
            }
          }
        },
        
        record_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            isInt: {
                msg: 'Record ID must be a valid integer.'
            }
          }
        },

        old_value: {
          type: Sequelize.JSONB,
          allowNull: true,
        }, 

        new_value: {
          type: Sequelize.JSONB,
          allowNull: true,
        },

        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            isInt: {
                msg: 'User ID must be a valid integer.'
            }
          }
        },

        supervisor_seller_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
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
      tableName: 'audit_logs',
      schema
    })
  }
}
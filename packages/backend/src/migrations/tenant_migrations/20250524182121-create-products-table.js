/**
 * Sequelize migration to create the `products` table.
 *
 * The table includes:
 * - `id`: Auto-incrementing primary key.
 * - `barcode`: Product's barcode string required and non-empty.
 * - `name`: Product's name, required and non-empty.
 * - `purchase_price`: Product's purchase price number, required.
 * - `selling_price`: Product's selling price, required.
 * - `stock`: Product's stock number, required.
 *
 * The table is created within the specified schema.
 *
 * @param {import('sequelize').QueryInterface} queryInterface - The interface for database operations.
 * @param {import('sequelize')} Sequelize - Sequelize library for defining data types.
 * @param {string} schema - The database schema where the table will be created.
 * @returns {Promise<void>}
 */
export default {
  up: async (queryInterface, Sequelize, schema)  => {
      await queryInterface.createTable(
        'products',
        {
          id: {
            type: Sequelize.INTEGER, 
            autoIncrement: true, 
            primaryKey: true
          },

          barcode: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '0000000000001'
          },

          name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'Default product',
          },

          purchase_price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            valide: {
              isNumeric: true
            }
          },

          selling_price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            valide: {
              isNumeric: true
            }
          },

          stock: {
            type: Sequelize.INTEGER,
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
   * Reverts the migration by dropping the `products` table from the specified schema.
   *
   * @param {import('sequelize').QueryInterface} queryInterface - The interface for database operations.
   * @param {import('sequelize')} Sequelize - Sequelize library.
   * @param {string} schema - The database schema where the table will be dropped.
   * @returns {Promise<void>}
   */
  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.dropTable({
      tableName: 'products',
      schema: schema
    })
  }
};

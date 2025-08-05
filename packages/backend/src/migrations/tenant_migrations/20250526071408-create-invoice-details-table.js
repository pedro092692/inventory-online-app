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

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.dropTable({
      tableName: 'invoice_details',
      schema
    })
  }
};

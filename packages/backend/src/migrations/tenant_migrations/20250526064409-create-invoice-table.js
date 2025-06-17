export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.createTable(
      "invoices",
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
            model: "customers",
            key: "id"
          }, 
          onUpdate: "CASCADE",
        },

        seller_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "sellers",
            key: "id"
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },

        total: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
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

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.dropTable({
      tableName: "invoices",
      schema
    })
  }
};

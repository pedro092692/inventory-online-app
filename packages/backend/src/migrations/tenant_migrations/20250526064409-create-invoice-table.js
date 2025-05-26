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
          defaultValue: new Date(),
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

        total: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.00,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({
      tableName: "invoices",
      schema
    })
  }
};

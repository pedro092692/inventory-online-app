export default {
  async up (queryInterface, Sequelize, schema) {
    queryInterface.createTable(
      "payment_details",
      {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaaryKey: true
          },

          invoice_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "invoices",
              key: "id"
            },
            onDelete: "CASCADE"
          },

          payment_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "payments",
              key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
          },

          amount: {
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

  async down (queryInterface, Sequelize, schema) {
    queryInterface.dropTable({
      tableName: "payment_details",
      schema
    })
  }
};

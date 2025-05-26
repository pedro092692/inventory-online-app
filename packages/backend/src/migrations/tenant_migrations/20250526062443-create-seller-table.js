export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.createTable(
      "sellers",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },

        id_number: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },

        last_name: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },

        address: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "Venezuela",
          validate: {
            notEmpty: true
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
      tableName: "sellers",
      schema
    })
  }
};

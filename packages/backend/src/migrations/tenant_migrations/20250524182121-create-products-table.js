export default {
  up: async (queryInterface, Sequelize, schema)  => {
      await queryInterface.createTable(
        "products",
        {
          id: {
            type: Sequelize.INTEGER, 
            autoIncrement: true, 
            primaryKey: true
          },

          barcode: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "0000000000001"
          },

          name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "Default product",
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

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.dropTable({
      tableName: "products",
      schema
    })
  }
};

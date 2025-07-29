import fakerProduct from "../utils/fakerProducts.js";
const products = fakerProduct()
export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: "products",
        schema: schema
      },
      products
    )
  },

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: "products",
        schema: schema
      },
      null, // this means "no condition" = delete all rows
      {
        truncate: true,
        restartIdentity: true,
        cascade: true
      }
    )
  }
};

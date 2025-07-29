import fakerCustomer from "../utils/fakerClient.js";
const fakeClients = fakerCustomer()

export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: "customers",
        schema: schema
      },
      fakeClients
    )
   
  },

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: "customers",
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

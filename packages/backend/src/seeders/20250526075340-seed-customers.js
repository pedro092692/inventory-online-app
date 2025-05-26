export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: "customers",
        schema: schema
      },
      [
        {
          id: 1,
          id_number: 1000000, // Venezuelan ID number
          name: "John Doe",
          phone: "+58424000000", // Default phone number for Venezuela
        }
      ]
    )
   
  },

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: "customers",
        schema: schema
      },
      {
        id: 1
      }
    )
  }
};

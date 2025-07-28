export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: "customers",
        schema: schema
      },
      [
        {
          id_number: 1000000, // Venezuelan ID number
          name: "John Doe",
          phone: "+58424000000", // Default phone number for Venezuela
        },
        {
          id_number: 2000000, // Another Venezuelan ID number
          name: "Jane Smith",
          phone: "+58424000001", // Another phone number for Venezuela
        },
        {
          id_number: 3000000, // Yet another Venezuelan ID number
          name: "Carlos Perez",
          phone: "+58424000002", // Yet another phone number for Venezuela
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
        id: [1, 2, 3]
      }
    )
  }
};

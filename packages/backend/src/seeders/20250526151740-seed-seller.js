export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
          tableName: "sellers",
          schema: schema
      },
      [
        {
          id_number: 5000000, // Venezuelan ID number
          name: "Pedro",
          last_name: "Bastidas",
          address: "123 Main St, Caracas, Venezuela", // Example address
        },
        {
          id_number: 6000000, // Another Venezuelan ID number
          name: "Andrea",
          last_name: "Gonzalez",
          address: "456 Elm St, Maracaibo, Venezuela", // Another example address
        },
        {
          id_number: 6000000, // Yet another Venezuelan ID number
          name: "Xavier",
          last_name: "Martinez",
          address: "789 Oak St, Valencia, Venezuela", // Yet another example address
        }
      ]
    )
  },

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: "sellers",
        schema: schema
      },
      {
        id: [1, 2, 3] // Delete all seeded sellers
      }
    );
  }
};

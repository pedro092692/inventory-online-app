export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: "payment_details",
        schema: schema
      },
      [
        {
          id: 1,
          invoice_id: 1, 
          payment_id: 1,
          amount: 255
        },
        {
          id: 2,
          invoice_id: 2, 
          payment_id: 2,
          amount: 150
        },
        {
          id: 3, 
          invoice_id: 3,
          payment_id: 5,
          amount: 420
        }
      ]
    )
  },

down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: "payment_details",
        schema: schema
      },{
        id: [1,2,3] // Delete all seeded invoice payment details
      }
    )
  }
};

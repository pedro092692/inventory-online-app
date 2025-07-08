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
          amount: 711.97,
          reference_amount: 6.39
        },
        {
          id: 2,
          invoice_id: 2, 
          payment_id: 2,
          amount: 631.75,
          reference_amount: 5.67
        },
        {
          id: 3, 
          invoice_id: 3,
          payment_id: 5,
          amount: 6.06,
          reference_amount: 6.06
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

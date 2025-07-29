export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: "payment_details",
        schema: schema
      },
      [
        {
          invoice_id: 1, 
          payment_id: 1,
          amount: 711.97,
          reference_amount: 6.39
        },
        {
          invoice_id: 2, 
          payment_id: 2,
          amount: 631.75,
          reference_amount: 5.67
        },
        { 
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

export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: "invoice_details",
        schema: schema
      },
      [
        {
          invoice_id: 1, // Assuming invoice with ID 1 exists
          product_id: 1, // Assuming product with ID 1 exists
          quantity: 1,
          unit_price: 5.67,
        },
        {
          invoice_id: 1, // Assuming invoice with ID 1 exists
          product_id: 2, // Assuming product with ID 2 exists
          quantity: 1,
          unit_price: 0.72,
        },
        {
          invoice_id: 2, // Assuming invoice with ID 2 exists
          product_id: 1, // Assuming product with ID 3 exists
          quantity: 1,
          unit_price: 5.67,
        },
        {
          invoice_id: 3, // Assuming invoice with ID 2 exists
          product_id: 2, // Assuming product with ID 3 exists
          quantity: 2,
          unit_price: 0.72,
        },
        {
          invoice_id: 3, // Assuming invoice with ID 3 exists
          product_id: 3, // Assuming product with ID 2 exists
          quantity: 1,
          unit_price: 4.62,
        },
      ]
    );
  },

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: "invoice_details",
        schema: schema
      },
      {
        id: [1, 2, 3, 4, 5] // Delete all seeded invoice details
      }
    );
  }
};

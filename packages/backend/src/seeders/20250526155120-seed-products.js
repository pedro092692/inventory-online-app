export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: "products",
        schema: schema
      },
      [
        {
          id: 1,
          barcode: "1234567890123",
          name: "Aflamax",
          purchase_price: 100.00,
          selling_price: 150.00,
          stock: 50,
        },
        {
          id: 2,
          barcode: "1234567890124",
          name: "Paracetamol",
          purchase_price: 50.00,
          selling_price: 75.00,
          stock: 100,
        },
        {
          id: 3,
          barcode: "1234567890125",
          name: "Ibuprofeno",
          purchase_price: 80.00,
          selling_price: 120.00,
          stock: 75,
        },
      ],
    )
  },

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: "products",
        schema: schema
      },
      {
        id: [1, 2, 3] // Delete all seeded products
      }
    )
  }
};

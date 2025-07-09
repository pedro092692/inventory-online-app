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
          purchase_price: 3.97,
          selling_price: 5.67,
          stock: 50,
        },
        {
          id: 2,
          barcode: "1234567890124",
          name: "Paracetamol",
          purchase_price: 0.36,
          selling_price: 0.72,
          stock: 100,
        },
        {
          id: 3,
          barcode: "1234567890125",
          name: "Ibuprofeno",
          purchase_price: 2.77,
          selling_price: 4.62,
          stock: 75,
        },
        {
          id: 4,
          barcode: "7592710003707",
          name: "ADELGASEN CAP X30 HERB",
          purchase_price: 8.25,
          selling_price: 10.31,
          stock: 1,
        }
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
        id: [1, 2, 3, 4] // Delete all seeded products
      }
    )
  }
};

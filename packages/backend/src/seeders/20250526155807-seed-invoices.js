export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: "invoices",
        schema: schema
      },
      [
        {
          date: new Date("2023-05-01T10:00:00Z"),
          customer_id: 1, // Assuming customer with ID 1 exists
          seller_id: 1, // Assuming seller with ID 1 exists
          total: 6.39,
          total_reference: 6.39 * 112.82,
          status: "unpaid"
        },
        {
          date: new Date("2023-05-02T11:30:00Z"),
          customer_id: 2, // Assuming customer with ID 2 exists
          seller_id: 2, // Assuming seller with ID 2 exists
          total: 5.67,
          total_reference: 5.67 * 112.82,
          status: "unpaid"
        },
        {
          date: new Date("2023-05-03T14:45:00Z"),
          customer_id: 3, // Assuming customer with ID 3 exists
          seller_id: 3, // Assuming seller with ID 3 exists
          total: 6.06,
          total_reference: 6.06 * 112.82,
          status: "unpaid"
        }
      ],
    )

  },

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: "invoices",
        schema: schema
      },
      {
        id: [1, 2, 3] // Delete all seeded invoices
      }
    )
  }
};

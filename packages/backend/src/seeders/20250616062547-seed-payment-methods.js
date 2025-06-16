export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: "payments",
        schema: schema
      },
      [
        {
          id: 1,
          name: "Punto de venta",
          currency: "Bolivar Digital"
        },
        {
          id: 2,
          name: "Pago Movil",
          currency: "Bolivar Digital"
        },
        {
          id: 3, 
          name: "Transferencia",
          currency: "Bolivar Digital"
        },
        {
          id: 4,
          name: "Efectivo Bolivares",
          currency: "Bolivares"
        },
        {
          id: 5, 
          name: "Efectivo Dolares",
          currency: "Dolares"
        },
        {
          id: 6,
          name: "Transferencia Dolares",
          currency: "Dolares"
        },
        {
          id: 7,
          name: "Cripto",
          currency: "Criptomonedas"
        }
      ]
    )
  },

  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: "payments",
        schema: schema
      },
      {
        id:[1,2,3,4,5,6,7] // delete all seeded payments
      }
    )
  }
}

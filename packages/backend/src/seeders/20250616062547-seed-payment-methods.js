export default {
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: "payments",
        schema: schema
      },
      [
        {
          name: "Punto de venta",
          currency: "Bolivar Digital"
        },
        {
          name: "Pago Movil",
          currency: "Bolivar Digital"
        },
        { 
          name: "Transferencia",
          currency: "Bolivar Digital"
        },
        {
          name: "Efectivo Bolivares",
          currency: "Bolivares"
        },
        { 
          name: "Efectivo Dolares",
          currency: "Dolares"
        },
        {
          name: "Transferencia Dolares",
          currency: "Dolares"
        },
        {
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

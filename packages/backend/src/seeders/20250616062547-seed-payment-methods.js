export default {
  /**
   * Inserts default data into the `payments` table within the specified schema.
   * It includes: 
   * `Punto de venta`, `Pago movil`, `Transferencia`, `Efectivo bolivares`, `Efectivo dolares`
   * `Transferencia Dolares`, `Cripto`
   * @param {object} queryInterface - Sequelize's query interface for database operations.
   * @param {object} Sequelize - Sequelize library instance (not used directly here).
   * @param {string} schema - The name of the database schema to target.
   * @returns {Promise<void>}
   */
  up: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkInsert(
      {
        tableName: 'payments',
        schema: schema
      },
      [
        {
          name: 'Punto de venta',
          currency: 'Bolivar Digital'
        },
        {
          name: 'Pago Movil',
          currency: 'Bolivar Digital'
        },
        { 
          name: 'Transferencia',
          currency: 'Bolivar Digital'
        },
        {
          name: 'Efectivo Bolivares',
          currency: 'Bolivares'
        },
        { 
          name: 'Efectivo Dolares',
          currency: 'Dolares'
        },
        {
          name: 'Transferencia Dolares',
          currency: 'Dolares'
        },
        {
          name: 'Cripto',
          currency: 'Criptomonedas'
        }
      ]
    )
  },

  /**
   * Deletes all data from the `payments` table within the specified schema.
   * Uses `truncate` to remove all rows and reset identity counters.
   *
   * @param {object} queryInterface - Sequelize's query interface for database operations.
   * @param {object} Sequelize - Sequelize library instance (not used directly here).
   * @param {string} schema - The name of the database schema to target.
   * @returns {Promise<void>}
   */
  down: async (queryInterface, Sequelize, schema) => {
    await queryInterface.bulkDelete(
      {
        tableName: 'payments',
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
}

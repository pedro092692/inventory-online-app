import pkg from '../config/config.js'

const currentEnv = process.env.NODE_ENV || 'development'
const {credit_method_id} = pkg[currentEnv]

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
          id: 1,
          name: 'Punto de venta',
          currency: 'Bolivar Digital',
          allow_change: false
        },
        {
          id: 2,
          name: 'Pago Movil',
          currency: 'Bolivar Digital',
          allow_change: false
        },
        { 
          id: 3,
          name: 'Transferencia',
          currency: 'Bolivar Digital',
          allow_change: false
        },
        {
          id: 4,
          name: 'Efectivo Bolivares',
          currency: 'Bolivar Digital',
          allow_change: true
        },
        { 
          id: 5,
          name: 'Efectivo Dolares',
          currency: 'Dolares',
          allow_change: true
        },
        {
          id: 6,
          name: 'Transferencia Dolares',
          currency: 'Dolares',
          allow_change: false
        },
        {
          id: 7,
          name: 'Cripto',
          currency: 'Criptomonedas',
          allow_change: false
        },
        {
          id: credit_method_id,
          name: 'Nota de Credito',
          currency: 'Saldo tienda',
          allow_change: false
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

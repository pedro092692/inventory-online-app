import { cashMovements } from '../utils/fakerCashMovements.js'

export default {
  async up (queryInterface, Sequelize, schema) {
    await queryInterface.bulkInsert(
      {
        tableName: 'cash_movements',
        schema: schema
      },
      cashMovements
    )
  },

  async down (queryInterface, Sequelize, schema) {
    await queryInterface.bulkDelete(
      {
        tableName: 'cash_movements',
        schema: schema
      },
      null,
      {
        truncate: true,
        restartIdentity: true,
        cascade: true
      }
    )
  }
};

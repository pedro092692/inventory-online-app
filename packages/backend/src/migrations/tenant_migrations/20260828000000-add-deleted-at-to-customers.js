/**
 * Sequelize migration (tenant schema) for adding a `deletedAt` column to `customers`,
 * enabling soft-delete (Sequelize `paranoid`) on the Customer model. Customers with
 * invoices or credits associated to them can no longer be hard-deleted safely (it would
 * orphan/break those records), so instead of blocking the delete with a validation error
 * we now mark the customer as deleted while keeping the row (and its history) intact.
 */

export default {
  async up (queryInterface, Sequelize, schema) {
    const table = { tableName: 'customers', schema: schema }
    await queryInterface.addColumn(table, 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize, schema) {
    const table = { tableName: 'customers', schema: schema }
    await queryInterface.removeColumn(table, 'deletedAt')
  }
};

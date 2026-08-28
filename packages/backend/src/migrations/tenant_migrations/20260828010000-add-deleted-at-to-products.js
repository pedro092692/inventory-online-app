/**
 * Sequelize migration (tenant schema) for adding a `deletedAt` column to `products`,
 * enabling soft-delete (Sequelize `paranoid`) on the Product model. Products that have
 * invoice history can no longer be hard-deleted safely (it would break invoice_details
 * referencing them), so instead of blocking the delete with a validation error we now
 * mark the product as deleted while keeping the row (and the invoices/receipts that
 * reference it) intact.
 */

export default {
  async up (queryInterface, Sequelize, schema) {
    const table = { tableName: 'products', schema: schema }
    await queryInterface.addColumn(table, 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize, schema) {
    const table = { tableName: 'products', schema: schema }
    await queryInterface.removeColumn(table, 'deletedAt')
  }
};

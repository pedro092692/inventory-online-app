/**
 * Sequelize migration for adding user and category to cash movements.
 */

export default {
  async up (queryInterface, Sequelize, schema) {
    const table = { tableName: 'cash_movements', schema: schema }
    await queryInterface.addColumn(table, 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: 'RESTRICT'
    })

      await queryInterface.addColumn(table, 'movement_category', {
      type: Sequelize.ENUM(
        'invoice_payment',
        'invoice_change',
        'withdrawal',
        'deposit',
        'adjustment',
      ),
      allowNull: false,
      defaultValue: 'invoice_payment'
    })

    await queryInterface.renameColumn(table, 'amount_ref', 'applied_to_invoice_amount')

    await queryInterface.changeColumn(table, 'applied_to_invoice_amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    })

    await queryInterface.addColumn(table, 'converted_amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize, schema) {
    const table = { tableName: 'cash_movements', schema: schema }
    await queryInterface.removeColumn(table, 'converted_amount')
    await queryInterface.renameColumn(table, 'applied_to_invoice_amount', 'amount_ref')
    await queryInterface.removeColumn(table, 'movement_category')
    await queryInterface.removeColumn(table, 'user_id')
  }
};

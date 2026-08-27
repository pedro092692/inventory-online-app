/**
 * Sequelize migration (tenant schema) for adding a per-product "stock mínimo" threshold
 * to products, so low-stock alerts can be computed as `stock <= min_stock`. Defaults to
 * 5 so every existing product starts with a sensible alert threshold without the owner
 * having to configure anything up front — they can raise/lower it per product later from
 * the add/edit product form.
 */

export default {
  async up (queryInterface, Sequelize, schema) {
    const table = { tableName: 'products', schema: schema }
    await queryInterface.addColumn(table, 'min_stock', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5
    })
  },

  async down (queryInterface, Sequelize, schema) {
    const table = { tableName: 'products', schema: schema }
    await queryInterface.removeColumn(table, 'min_stock')
  }
};

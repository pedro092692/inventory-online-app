/**
 * Sequelize migration (tenant schema) that widens `products.purchase_price` and
 * `products.selling_price` from DECIMAL(10,2) to DECIMAL(10,4).
 *
 * Why: Product prices are the single canonical USD value Nexastock stores, but a bulk
 * import that converts from a foreign-currency source (e.g. the "Zyon" provider import —
 * see ProductService.createProductsBulkFromZyon) divides a Bs price by the day's exchange
 * rate. At typical rates (hundreds to low thousands of Bs per USD), 1 cent of USD can be
 * worth several Bs, so rounding the converted price to 2 decimals can noticeably drift the
 * price if reconstructed back to Bs later — and for very cheap products, round it all the
 * way down to $0.00. Widening the stored precision to 4 decimals shrinks that rounding
 * "grid" by ~100x, making the stored price far more faithful to its original source.
 *
 * This does NOT change how invoices/payments compute totals: that math already rounds to
 * 2 decimals on its own (see ProductService._buffereredPrices, used by every price a
 * customer actually sees or pays), so widening this column only affects what's stored,
 * not any money already in flight. Existing 2-decimal values are unaffected — Postgres
 * widens a DECIMAL's scale losslessly.
 */

export default {
  async up (queryInterface, Sequelize, schema) {
    const table = { tableName: 'products', schema: schema }
    await queryInterface.changeColumn(table, 'purchase_price', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: false
    })
    await queryInterface.changeColumn(table, 'selling_price', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize, schema) {
    const table = { tableName: 'products', schema: schema }
    await queryInterface.changeColumn(table, 'purchase_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    })
    await queryInterface.changeColumn(table, 'selling_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    })
  }
};

/**
 * Sequelize migration (tenant schema) that widens `invoice_details.unit_price` and
 * `invoices.total` / `invoices.total_paid` from DECIMAL(10,2) to DECIMAL(10,4).
 *
 * Why: this is the same class of problem the earlier products price-precision migration
 * fixed, one step further down the pipeline. `ProductService.getProductUnitPrice` (used by
 * InvoiceService.addInvoiceDetails when a sale is made) captures each line's price via
 * `_buffereredPrices`, which used to hard-round to 2 decimals — so even though
 * `products.selling_price` now carries 4 decimals, the price actually frozen into
 * `invoice_details.unit_price` at sale time was still only 2-decimal USD. At typical Bs/USD
 * rates, 1 cent of USD can be worth several Bs, so that 2-decimal snapshot can drift when
 * reconstructed back to Bs later (invoice detail view, WhatsApp message, PDF/print) — the
 * exact "solo evitar $0.00 (...) precisión" fix applied to products, needed here too.
 * `invoices.total` (the sum of unit_price × quantity, see utils/calculeTotal.js) also has to
 * widen, or summing higher-precision unit_prices would just get truncated back to 2 decimals
 * the moment the total is stored, undoing the point. `total_paid` widens alongside it for the
 * same reason and for consistency in the `total_paid >= total` comparison in PayInvoiceService.
 *
 * This does NOT change how much money actually changes hands: every point in the payment flow
 * that needs a whole-cent amount (change due, "is this fully paid", the Bs a customer is
 * actually asked to hand over) already rounds explicitly to 2 decimals right there in
 * PayInvoiceService, regardless of how many decimals the underlying columns carry — see e.g.
 * `total_to_pay = (total - total_paid).toFixed(2)`. This migration only makes the STORED
 * unit price / total more faithful to their original source, the same way the products
 * migration did. Existing 2-decimal values are unaffected — Postgres widens a DECIMAL's scale
 * losslessly. `invoices.total_reference` is a Bs amount and stays at 2 decimals — Bs currency
 * itself doesn't need finer subdivision; the drift this migration targets is specifically on
 * the USD side.
 */

export default {
  async up (queryInterface, Sequelize, schema) {
    await queryInterface.changeColumn({ tableName: 'invoice_details', schema }, 'unit_price', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: false
    })
    await queryInterface.changeColumn({ tableName: 'invoices', schema }, 'total', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: false,
      defaultValue: 0.00
    })
    await queryInterface.changeColumn({ tableName: 'invoices', schema }, 'total_paid', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: true,
      defaultValue: 0.00
    })
  },

  async down (queryInterface, Sequelize, schema) {
    await queryInterface.changeColumn({ tableName: 'invoice_details', schema }, 'unit_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    })
    await queryInterface.changeColumn({ tableName: 'invoices', schema }, 'total', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    })
    await queryInterface.changeColumn({ tableName: 'invoices', schema }, 'total_paid', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    })
  }
};

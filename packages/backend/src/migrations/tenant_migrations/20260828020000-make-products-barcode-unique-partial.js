/**
 * Sequelize migration (tenant schema) that turns the plain UNIQUE constraint on
 * `products.barcode` into a *partial* unique index scoped to non-deleted products
 * (`WHERE "deletedAt" IS NULL`).
 *
 * Why: now that Product is `paranoid` (soft-delete), a deleted product's row still
 * exists in the table. A plain unique constraint would keep blocking that barcode
 * forever, even though the product is gone from every normal query — you'd never be
 * able to re-add a product (or re-import it via the Excel bulk upload) with the same
 * barcode again. A partial index only enforces uniqueness among the products that are
 * still active, so a deleted product's barcode becomes free to reuse.
 *
 * The original constraint was created inline (`unique: true`) when the table was
 * created, so Postgres auto-named it — we look it up dynamically instead of guessing
 * the name, so this works no matter what it ended up being called in a given tenant
 * schema.
 */

const PARTIAL_INDEX_NAME = 'products_barcode_active_unique'

export default {
  async up (queryInterface, Sequelize, schema) {
    const [existingUniqueConstraints] = await queryInterface.sequelize.query(
      `
      SELECT con.conname
      FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
      JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY(con.conkey)
      WHERE nsp.nspname = :schema
        AND rel.relname = 'products'
        AND con.contype = 'u'
        AND att.attname = 'barcode'
      `,
      { replacements: { schema } }
    )

    for (const { conname } of existingUniqueConstraints) {
      await queryInterface.sequelize.query(
        `ALTER TABLE "${schema}"."products" DROP CONSTRAINT "${conname}"`
      )
    }

    await queryInterface.sequelize.query(
      `CREATE UNIQUE INDEX "${PARTIAL_INDEX_NAME}" ON "${schema}"."products" ("barcode") WHERE "deletedAt" IS NULL`
    )
  },

  async down (queryInterface, Sequelize, schema) {
    await queryInterface.sequelize.query(
      `DROP INDEX IF EXISTS "${schema}"."${PARTIAL_INDEX_NAME}"`
    )

    await queryInterface.sequelize.query(
      `ALTER TABLE "${schema}"."products" ADD CONSTRAINT "products_barcode_key" UNIQUE ("barcode")`
    )
  }
};

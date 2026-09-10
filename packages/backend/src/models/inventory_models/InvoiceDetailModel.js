import { DataTypes, Model } from 'sequelize'

/**
 * Initializes the InvoiceDetail model with its schema definition and configuration.
 * This function sets up the InvoiceDetail model with fields such as `id`, `invoice_id`, `product_id`, `quantity` and `unit_price`,
 * and configures Sequelize options like table name, schema, and timestamps.
 *
 * IMPORTANT: the `InvoiceDetail` class is defined INSIDE this function on purpose, so every call
 * returns a brand-new class bound to its own `sequelize`/`schema` — see the comment in
 * CustomerModel.js for why a shared, module-level class is unsafe in a schema-per-tenant setup.
 * @param {import('sequelize').Sequelize} sequelize - The Sequelize instance used to initialize the model.
 * @param {string} schema - The schame used to register the model.
 * @return {InvoiceDetail: typeof model} returns InvoiceDetail model..
 */
function initializeInvoiceDetail(sequelize, schema) {
    class InvoiceDetail extends Model {
        // model ralations

        /**
         * Creates an association between the InvoiceDetail model and the Invoice model.
         * @param {{ Invoice: typeof Model }} model - An object containing the Invoice model class.
         * @returns {void} This method does not return a value.
         */
        static associationInvoice(model) {
            this.belongsTo(model.Invoice, {
                foreignKey: 'invoice_id',
                as: 'invoice'
            })
        }

        /**
         * Creates an association between the InvoiceDetail model and the Product model.
         * @param {{ Product: typeof Model}} model - An object containing the Product model class.
         * @returns {void} This method does not return a value.
         */
        static associationProducts(model) {
            this.belongsTo(model.Product, {
                foreignKey: 'product_id',
                as: 'products'
            })
        }

        /**
         * Creates an association between the InvoiceDetail model and the InvoiceReturn model.
         * @param {{InvoiceReturn: typeof Model}} model - An object containing the InvoiceDetail model class.
         * @returns {void} This method does not return a value.
         */
        static associationInvoiceReturn(model) {
            this.hasMany(model.InvoiceReturn, {
                foreignKey: 'invoice_detail_id',
                as: 'invoice_returns'
            })
        }
    }

    InvoiceDetail.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'invoices',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },

            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'restrict'
            },

            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    isNumeric: {
                        msg: 'A valid number is required.'
                    }
                }
            },

            unit_price: {
                // DECIMAL(10, 4): widened from (10, 2) so the price frozen into this column at
                // sale time (see ProductService.getProductUnitPrice) keeps the same precision
                // products.selling_price now carries. At typical Bs/USD rates, 1 cent of USD is
                // worth several Bs, so a 2-decimal snapshot drifted whenever this price was
                // re-multiplied by the exchange rate later (checkout, WhatsApp, PDF/print) —
                // see the invoice-price-precision migration for the full explanation.
                type: DataTypes.DECIMAL(10, 4),
                allowNull: false,
                validate: {
                    isNumeric: {
                        msg: 'A valid price is required.'
                    }
                }
            }

        },
        {
            sequelize,
            modelName: 'InvoiceDetail',
            tableName: 'invoice_details',
            timestamps: false,
            schema: schema
        }
    )
    return InvoiceDetail
}

export { initializeInvoiceDetail }

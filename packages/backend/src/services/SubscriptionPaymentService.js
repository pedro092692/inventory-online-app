import ServiceErrorHandler from '../errors/ServiceErrorHandler.js'
import { NotFoundError } from '../errors/NofoundError.js'
import Database from '../database/database.js'
import { Store } from '../models/StoreModel.js'
import { PlatFormExchangeRate } from '../models/PlatformExchangeRateModel.js'
import { SubscriptionPayment } from '../models/SubscriptionPaymentModel.js'
import StorageService from './StorageService.js'
import pkg from '../config/config.js'
import process from 'process'

const currentEnv = process.env.NODE_ENV || 'development'
const { subscription_price_usd } = pkg[currentEnv]

/**
 * Store-owner-facing subscription payment flow: seeing what's owed, submitting a
 * receipt for a payment already made, and reviewing your own submission history.
 * Admin-side review (approve/reject) lives in the admin UserService instead.
 */
class SubscriptionPaymentService {
    #error = new ServiceErrorHandler()

    constructor() {
        this.db = new Database()
        this.storage = new StorageService()
        this.#error
    }

    /**
     * Retrieves the current store owner's own store profile, health stats, and how
     * much (in Bs) is currently due for the next subscription renewal.
     * @param {number} tenantId - The tenant ID (the store owner's own user id).
     * @returns {Promise<Object>} { store, stats, amountDueUsd, amountDueBs, exchangeRate }
     * @throws {NotFoundError} If the store does not exist.
     */
    getMyStoreOverview(tenantId) {
        return this.#error.handler(['Read my store overview', tenantId, 'Store'], async () => {
            const store = await Store.findOne({ where: { tenant_id: tenantId } })
            if (!store) {
                throw new NotFoundError()
            }

            const tenant = await this.db.tenant.TenantConnection(tenantId)
            const [sellerCount, customerCount, lastInvoice] = await Promise.all([
                tenant.models.Seller.count(),
                tenant.models.Customer.count(),
                tenant.models.Invoice.findOne({
                    attributes: ['id', 'date'],
                    order: [['date', 'DESC']]
                })
            ])

            const lastRate = await PlatFormExchangeRate.findOne({ order: [['id', 'DESC']] })
            const amountDueBs = lastRate ? Number((subscription_price_usd * lastRate.value).toFixed(2)) : null

            return {
                store,
                stats: {
                    sellerCount,
                    customerCount,
                    lastInvoiceDate: lastInvoice?.date || null
                },
                amountDueUsd: subscription_price_usd,
                amountDueBs,
                exchangeRate: lastRate?.value ?? null
            }
        })
    }

    /**
     * Submits a subscription payment receipt for admin review. Uploads the receipt
     * image to private object storage and creates a `pending` SubscriptionPayment row.
     * @param {number} tenantId - The tenant ID submitting the payment.
     * @param {number|string} amountDeclared - The amount (in Bs) the owner says they paid.
     * @param {{buffer: Buffer, mimetype: string, originalname: string}} file - The uploaded receipt (from multer).
     * @returns {Promise<Object>} The created SubscriptionPayment row.
     * @throws {NotFoundError} If the store does not exist.
     */
    submitPayment(tenantId, amountDeclared, file) {
        return this.#error.handler(['Submit subscription payment', tenantId, 'SubscriptionPayment'], async () => {
            const store = await Store.findOne({ where: { tenant_id: tenantId } })
            if (!store) {
                throw new NotFoundError()
            }

            if (!file) {
                throw new Error('El comprobante de pago es requerido.')
            }

            const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')
            const key = `receipts/${tenantId}/${Date.now()}-${safeName}`
            await this.storage.uploadFile(key, file.buffer, file.mimetype)

            const lastRate = await PlatFormExchangeRate.findOne({ order: [['id', 'DESC']] })
            const amountExpected = lastRate ? Number((subscription_price_usd * lastRate.value).toFixed(2)) : null

            const payment = await SubscriptionPayment.create({
                tenant_id: tenantId,
                amount_declared: amountDeclared,
                amount_expected: amountExpected,
                receipt_key: key,
                status: 'pending',
                submitted_at: new Date()
            })

            return payment
        })
    }

    /**
     * Retrieves the current store owner's own submitted payments, most recent first.
     * @param {number} tenantId - The tenant ID.
     * @param {number} [limit=10] - Max number of records.
     * @param {number} [page=1] - Page number.
     * @returns {Promise<Array>} The tenant's SubscriptionPayment rows.
     */
    getMyPayments(tenantId, limit = 10, page = 1) {
        const offset = (page - 1) * limit
        return this.#error.handler(['Read my subscription payments', tenantId, 'SubscriptionPayment'], async () => {
            const payments = await SubscriptionPayment.findAll({
                where: { tenant_id: tenantId },
                attributes: ['id', 'amount_declared', 'amount_expected', 'status', 'submitted_at', 'reviewed_at', 'rejection_reason'],
                order: [['submitted_at', 'DESC']],
                limit,
                offset
            })
            return payments
        })
    }
}

export default SubscriptionPaymentService

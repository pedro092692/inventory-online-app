import { Store } from '../models/StoreModel.js'

/**
 * Computes and exposes a store's active status for the store's own users
 * (owner/sellers), and is also reused by the `requireActiveStore` middleware
 * so the "is this store active?" logic lives in exactly one place.
 */
class StoreStatusService {

    /**
     * Resolves whether a tenant's store is currently active, and why not when it isn't.
     * A store is inactive when it was manually blocked (`is_active = false`) OR its
     * subscription expired (`subscription_expires_at` is in the past).
     *
     * @param {number} tenantId - The tenant ID (the store owner's user id).
     * @returns {Promise<{active: boolean, reason: string|null}>}
     */
    async getStatus(tenantId) {
        const store = await Store.findOne({ where: { tenant_id: tenantId } })

        // No store row (e.g. an admin, or a tenant without a Store yet): treat as active,
        // this service only blocks/warns about KNOWN inactive stores.
        if (!store) {
            return { active: true, reason: null }
        }

        const subscriptionExpired = store.subscription_expires_at && new Date(store.subscription_expires_at) < new Date()
        const active = store.is_active && !subscriptionExpired

        if (active) {
            return { active: true, reason: null }
        }

        const reason = !store.is_active
            ? `Tu tienda fue bloqueada. Motivo: ${store.blocked_reason || 'contacta al administrador.'}`
            : 'La suscripción de tu tienda venció. Contacta al administrador para renovarla.'

        return { active: false, reason }
    }
}

export default StoreStatusService

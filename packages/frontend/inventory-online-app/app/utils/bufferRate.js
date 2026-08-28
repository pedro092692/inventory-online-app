/**
 * Applies the store's "tasa colchón" (buffer exchange rate) to a product's USD price,
 * for informational-only surfaces (Cotizar, Etiquetas). Real sales/invoices never call
 * this — they keep reading `selling_price`/`reference_selling_price` as-is.
 *
 * The trick (as described by the store owner): rather than just showing an inflated Bs
 * price at the official rate — which looks like straight price-gouging to a customer who
 * knows the official rate — the displayed USD price is inflated by the same ratio, so a
 * customer who multiplies displayedUsd × officialRate gets exactly the buffered Bs amount
 * back. The math "checks out" against the rate they know, while the store still effectively
 * charges the buffer rate.
 *
 *   displayedUsd = originalUsd × (bufferRate / officialRate)
 *   displayedBs  = originalUsd × bufferRate   (=== displayedUsd × officialRate)
 *
 * @param {number|string} originalUsd - the product's real USD selling price.
 * @param {number|string|null} officialRate - the current official Bs-per-dollar rate.
 * @param {{buffer_enabled?: boolean, buffer_rate?: number|string|null}|null} settings - the store's buffer settings.
 * @returns {{usd: number, bs: number}} the prices to display — buffered when enabled and
 * usable, otherwise the same values the app shows everywhere else.
 */
export function applyBufferRate(originalUsd, officialRate, settings) {
    const usd = parseFloat(originalUsd) || 0
    const rate = parseFloat(officialRate) || 0
    const bufferRate = parseFloat(settings?.buffer_rate) || 0

    if (!settings?.buffer_enabled || !bufferRate || !rate) {
        return {
            usd,
            bs: usd * rate
        }
    }

    return {
        usd: usd * (bufferRate / rate),
        bs: usd * bufferRate
    }
}

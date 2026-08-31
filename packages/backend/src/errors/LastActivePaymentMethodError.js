/**
 * Thrown when an update would leave the store with zero active, sellable
 * payment methods (i.e. disabling the last one still active). Selling
 * requires at least one active payment method, so this is always rejected.
 */
class LastActivePaymentMethodError extends Error {
    constructor(message = 'Debe existir al menos un método de pago activo. No puedes desactivar el último método de pago disponible.') {
        super(message)
        this.name = 'LastActivePaymentMethodError'
    }
}

export { LastActivePaymentMethodError }

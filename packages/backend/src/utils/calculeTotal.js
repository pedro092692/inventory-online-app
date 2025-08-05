/**
 * Calculates the total amount of an invoice based on its line items.
 *
 * @param {Array<{ quantity: number, unit_price: number }>} object - Array of invoice line items.
 * @returns {number} Total amount of the invoice.
 */

function calculeTotalInvoice(object) {
    const total = object.reduce( (sum, detail) => sum + (detail.quantity * detail.unit_price), 0)
    return total
}

export default calculeTotalInvoice
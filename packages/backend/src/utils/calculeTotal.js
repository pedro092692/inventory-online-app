function calculeTotalInvoice(object) {
    const total = object.reduce( (sum, detail) => sum + (detail.quantity * detail.unit_price), 0)
    return total
}

export default calculeTotalInvoice
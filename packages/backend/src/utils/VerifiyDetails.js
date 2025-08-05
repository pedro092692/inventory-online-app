function verifyDetails(details, update = false) {
    if (!Array.isArray(details) || details.length === 0) {
        throw new Error('Details must be a non-empty array');
    }

    for (const detail of details) {
        if (typeof detail !== 'object' || detail === null) {
            throw new Error('Each detail must be a non-null object');
        }
        if (!detail.product_id || typeof detail.product_id !== 'number') {
            throw new Error('Each detail must have a valid product_id');
        }
        if (!detail.quantity || typeof detail.quantity !== 'number' || detail.quantity <= 0) {
            throw new Error('Each detail must have a valid quantity greater than zero');
        }
        

        if (update && !detail.id) {
            throw new Error('Each detail must have an id when updating');
        }
    }
}

export default verifyDetails
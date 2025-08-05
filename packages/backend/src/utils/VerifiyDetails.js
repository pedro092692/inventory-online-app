/**
 * Verifies whether the provided invoice details meet the required validation rules.
 *
 * - Ensures `details` is a non-empty array.
 * - Each item must be a non-null object with valid `product_id` and `quantity`.
 * - If `update` is true, each item must also include an `id`.
 *
 * @param {Array<{ product_id: number, quantity: number, id?: number }>} details - Array of invoice detail objects to validate.
 * @param {boolean} [update=false] - Indicates whether the validation is for an update operation.
 * @throws {Error} If any validation rule is violated.
 * @returns {void} This function does not return a value.
 */

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
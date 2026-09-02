/**
 * Builds a safe Sequelize `order` array from client-supplied sort params.
 *
 * The client's `sortBy` value must NEVER be used directly as a column name — that would let a
 * request sort by an arbitrary (or non-existent) DB column. It is only accepted when it appears
 * in `allowedColumns`, a per-resource whitelist of real, sortable columns. Anything else
 * (missing, unknown, or tampered with) falls back to `defaultOrder`, so existing behavior for
 * pages that don't pass a sort param is unchanged.
 *
 * @param {string|null|undefined} sortBy - column key requested by the client (e.g. 'selling_price').
 * @param {string|null|undefined} sortDir - direction requested by the client, 'asc' or 'desc'. Anything other than 'asc' resolves to 'desc'.
 * @param {string[]} allowedColumns - whitelist of column names this resource may be sorted by.
 * @param {Array<Array<string>>} defaultOrder - Sequelize `order` array used when sortBy is missing or not in the whitelist.
 * @returns {Array<Array<string>>} A Sequelize-compatible `order` array.
 */
function resolveSortOrder(sortBy, sortDir, allowedColumns = [], defaultOrder = [['id', 'DESC']]) {
    if (!sortBy || !allowedColumns.includes(sortBy)) {
        return defaultOrder
    }

    const direction = sortDir === 'asc' ? 'ASC' : 'DESC'
    return [[sortBy, direction]]
}

export default resolveSortOrder

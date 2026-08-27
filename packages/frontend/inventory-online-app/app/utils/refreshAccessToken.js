const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1'

/**
 * Exchanges a refresh token for a new access token by calling the backend's
 * POST /api/security/refresh. Used from middleware to silently renew an expired access
 * token instead of forcing the user back to /login. Returns null on any failure (missing
 * or expired refresh token, network error) so callers fall back to the normal "not logged
 * in" path.
 * @param {string|undefined} refreshToken
 * @returns {Promise<string|null>}
 */
export async function refreshAccessToken(refreshToken) {
    if (!refreshToken) return null

    try {
        const res = await fetch(`${API_BASE_URL}/api/security/refresh`, {
            method: 'POST',
            headers: { 'Cookie': `refresh_token=${refreshToken}` },
        })

        if (!res.ok) return null

        // getSetCookie() returns each Set-Cookie header separately — .get('set-cookie')
        // would merge them into one comma-joined string and break parsing.
        const setCookies = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : []

        for (const rawCookie of setCookies) {
            const [pair] = rawCookie.split(';')
            const eqIdx = pair.indexOf('=')
            const name = pair.slice(0, eqIdx).trim()
            if (name === 'access_token') {
                return pair.slice(eqIdx + 1)
            }
        }

        return null
    } catch {
        return null
    }
}

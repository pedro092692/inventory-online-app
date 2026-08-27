import { verifyToken } from '../utils/verifyToken'
import { refreshAccessToken } from '../utils/refreshAccessToken'

// 1h — mirrors SecurityController.login's access_token cookie maxAge.
export const ACCESS_TOKEN_MAX_AGE = 60 * 60

/**
 * Verifies the current request's session. If the access token is missing, expired, or
 * otherwise invalid, and a refresh token is present, transparently exchanges it for a new
 * access token via the backend instead of treating the session as logged out. This is what
 * stops a user mid-task from being bounced to /login every time the 1h access token
 * expires — only once the refresh token itself expires (7 days, see SecurityService) does
 * the user actually need to log in again.
 *
 * Any network failure talking to the backend is treated as "not logged in" rather than
 * thrown, so a backend hiccup doesn't crash the whole middleware.
 *
 * @param {import('next/server').NextRequest} request
 * @returns {Promise<{valid: boolean, data: object|null, refreshedToken: string|null}>}
 */
export async function verifySession(request) {
    try {
        const token = request.cookies.get('access_token')?.value
        const result = token ? await verifyToken(token, true) : null

        if (result?.data) {
            return { valid: true, data: result.data, refreshedToken: null }
        }

        const refreshToken = request.cookies.get('refresh_token')?.value
        const newToken = await refreshAccessToken(refreshToken)

        if (!newToken) {
            return { valid: false, data: null, refreshedToken: null }
        }

        const refreshedResult = await verifyToken(newToken, true)
        if (refreshedResult?.data) {
            return { valid: true, data: refreshedResult.data, refreshedToken: newToken }
        }

        return { valid: false, data: null, refreshedToken: null }
    } catch {
        return { valid: false, data: null, refreshedToken: null }
    }
}

/**
 * Rebuilds the outgoing request's `Cookie` header with a refreshed access_token swapped
 * in, so Server Components/Actions rendered right after middleware (in this same request)
 * see the new token via next/headers `cookies()` — not just the browser on its next visit.
 * Pass the result as `NextResponse.next({ request: forwardedRequestInit(...) })`.
 *
 * @param {import('next/server').NextRequest} request
 * @param {string|null} refreshedToken
 * @returns {{headers: Headers}}
 */
export function forwardedRequestInit(request, refreshedToken) {
    if (!refreshedToken) return { headers: request.headers }

    const headers = new Headers(request.headers)
    const existingCookies = (headers.get('cookie') || '')
        .split(';')
        .map((c) => c.trim())
        .filter((c) => c && !c.startsWith('access_token='))
    existingCookies.push(`access_token=${refreshedToken}`)
    headers.set('cookie', existingCookies.join('; '))
    return { headers }
}

/**
 * Writes a refreshed access_token onto an outgoing NextResponse's cookies, so the browser
 * keeps it for future requests. No-op when there was no refresh.
 * @param {import('next/server').NextResponse} response
 * @param {string|null} refreshedToken
 * @returns {import('next/server').NextResponse}
 */
export function applyRefreshedCookie(response, refreshedToken) {
    if (!refreshedToken) return response
    response.cookies.set('access_token', refreshedToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: ACCESS_TOKEN_MAX_AGE,
    })
    return response
}

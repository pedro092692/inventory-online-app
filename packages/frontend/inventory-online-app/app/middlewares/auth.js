import { NextResponse } from 'next/server'
import { verifySession, forwardedRequestInit, applyRefreshedCookie } from './session'

export async function verifyAuth(request) {
    const isServerAction = request.headers.get('Next-Action') !== null
    const { valid, refreshedToken } = await verifySession(request)

    if (valid) {
        const response = NextResponse.next({ request: forwardedRequestInit(request, refreshedToken) })
        return applyRefreshedCookie(response, refreshedToken)
    }

    if (isServerAction) return NextResponse.next()

    const redirectUrl = new URL('/login', request.url)
    const next = request.nextUrl.pathname + request.nextUrl.search
    redirectUrl.searchParams.set('next', next)
    return NextResponse.redirect(redirectUrl)
}

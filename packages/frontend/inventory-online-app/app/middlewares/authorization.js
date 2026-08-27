import { NextResponse } from 'next/server'
import { verifySession, forwardedRequestInit, applyRefreshedCookie } from './session'

class AuthorizationMiddleWare {

    checkAuthorization = async (request) => {
        const { valid, data, refreshedToken } = await verifySession(request)

        if (!valid) {
            const redirectUrl = new URL('/login', request.url)
            redirectUrl.searchParams.set('next', new URL(request.url).pathname)
            return NextResponse.redirect(redirectUrl)
        }

        if (![1, 2, 3].includes(data.role)) {
            const response = NextResponse.redirect(new URL('/store', request.url))
            return applyRefreshedCookie(response, refreshedToken)
        }

        const response = NextResponse.next({ request: forwardedRequestInit(request, refreshedToken) })
        return applyRefreshedCookie(response, refreshedToken)
    }

    checkAdmin = async (request) => {
        const { valid, data, refreshedToken } = await verifySession(request)

        if (!valid) {
            // Previously redirected to /404 here specifically (unlike every other guard,
            // which goes to /login) — unified so an expired/missing session always sends
            // you to /login, consistent with checkAuthorization and verifyAuth.
            const redirectUrl = new URL('/login', request.url)
            redirectUrl.searchParams.set('next', new URL(request.url).pathname)
            return NextResponse.redirect(redirectUrl)
        }

        if (data.role != 1) {
            const response = NextResponse.redirect(new URL('/404', request.url))
            return applyRefreshedCookie(response, refreshedToken)
        }

        const response = NextResponse.next({ request: forwardedRequestInit(request, refreshedToken) })
        return applyRefreshedCookie(response, refreshedToken)
    }
}

const checkAuthorization = new AuthorizationMiddleWare().checkAuthorization
const checkAdmin = new AuthorizationMiddleWare().checkAdmin

export { checkAuthorization, checkAdmin }

import { NextResponse } from 'next/server'
import { verifySession, applyRefreshedCookie } from './session'

const dashboard = process.env.NEXT_PUBLIC_DASHBOARD

export async function redirectIfLoggedIn(request) {

    if (request.method !== 'GET') {
        return NextResponse.next()
    }

    const { valid, refreshedToken } = await verifySession(request)

    if (valid) {
        const response = NextResponse.redirect(new URL(dashboard, request.url))
        return applyRefreshedCookie(response, refreshedToken)
    }

    return NextResponse.next()
}

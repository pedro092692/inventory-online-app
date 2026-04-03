import { NextResponse } from 'next/server'
import { verifyToken } from '../utils/verifyToken'

export async function verifyAuth(request) {
    const isServerAction = request.headers.get('Next-Action') !== null
    const token = request.cookies.get('access_token')?.value
    if(!token) {
        if (isServerAction) return NextResponse.next()

        const redirectUrl = new URL('/login', request.url)
        const next = request.nextUrl.pathname + request.nextUrl.search
        redirectUrl.searchParams.set('next', next)
        return NextResponse.redirect(redirectUrl)

    }

    // verify token 
    const res = await verifyToken(token)
    if(res.ok) {
        return NextResponse.next()
    }

    // if token is invalid redirect to login
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('next', new URL(request.url).pathname)
    return NextResponse.redirect(redirectUrl)


}
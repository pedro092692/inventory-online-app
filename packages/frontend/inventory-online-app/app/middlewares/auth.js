import { NextResponse } from 'next/server'
import { verifyToken } from '../utils/verifyToken'

export async function verifyAuth(request) {
    const token = request.cookies.get('access_token')?.value
    if(!token) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('next', new URL(request.url).pathname)
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
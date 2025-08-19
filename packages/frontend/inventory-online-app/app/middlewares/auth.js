import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1'

export async function verifyAuth(request) {
    const token = request.cookies.get('access_token')?.value
    if(!token) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('next', new URL(request.url).pathname)
        return NextResponse.redirect(redirectUrl)

    }

    // verify token 
    const res = await fetch(`${API_BASE_URL}/api/security/verify-token`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: 'include'
    })

    if(res.ok) {
        return NextResponse.next()
    }

    // if token is invalid redirect to login
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('next', new URL(request.url).pathname)
    return NextResponse.redirect(redirectUrl)


}
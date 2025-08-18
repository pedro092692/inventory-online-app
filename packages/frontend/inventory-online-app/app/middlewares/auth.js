import { NextRequest, NextResponse } from 'next/server'

export function verifyAuth(request) {
    const token = request.cookies.get('access_token')?.value
    if(!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}
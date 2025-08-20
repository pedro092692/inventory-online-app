import { NextResponse } from 'next/server'
const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1'

export async function redirectIfLoggedIn(request) {
    const token = request.cookies.get('access_token')?.value
    if(!token) {
        return NextResponse.next();
    }

    try {
        // verity token 
        const res = await fetch(`${API_BASE_URL}/api/security/verify-token`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
            credentials: 'include'
        })

        if(res.ok) {
            return NextResponse.redirect(new URL('/', request.url));
        }else {
            return NextResponse.next();
        }
    } catch (err) {
        return NextResponse.next();
    }
}
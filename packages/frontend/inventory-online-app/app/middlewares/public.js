import { NextResponse } from 'next/server'
import { verifyToken } from '../utils/verifyToken'

const dashboard = process.env.NEXT_PUBLIC_DASHBOARD

export async function redirectIfLoggedIn(request) {
    const token = request.cookies.get('access_token')?.value
    if(!token) {
        return NextResponse.next();
    }

    try {
        // verify token
        const res = await verifyToken(token) 

        if(res.ok) {
            return NextResponse.redirect(new URL(dashboard, request.url));
        }else {
            return NextResponse.next();
        }
    } catch (err) {
        return NextResponse.next();
    }
}
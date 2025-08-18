import { verifyAuth } from './app/middlewares/auth.js'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return verifyAuth(request)
}

export const config = {
    matcher: ['/dashboard/:path*', '/inventory/:path*', '/orders/:path*', '/products/:path*'],
}
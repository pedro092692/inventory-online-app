import { verifyAuth } from './app/middlewares/auth.js'
import { redirectIfLoggedIn } from './app/middlewares/public.js'
import { checkAuthorization, checkAdmin } from './app/middlewares/authorization.js'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const publicPaths = ['/login']
  const privatePaths = ['/store', '/admin']
  const authorizePaths = ['/store/customers/edit',
                          '/store/products/edit',
                          '/store/products/add',
                          '/store/payment-methods',
                          '/store/currency',
                          '/store/reports',
                          '/store/staff',
                          '/api/export',
                        ]
  const adminPaths = ['/admin']

  if(publicPaths.some((path) => pathname.startsWith(path))) {
    // If the user is logged in, redirect them to the dashboard
    return redirectIfLoggedIn(request)
  }

  if(authorizePaths.some((path) => pathname.startsWith(path))) {
    return checkAuthorization(request)
  }

  if(adminPaths.some((path) => pathname.startsWith(path))) {
    return checkAdmin(request)
  }

  if(privatePaths.some((path) => pathname.startsWith(path))) {
    return verifyAuth(request)
  }

  
}

export const config = {
    matcher: ['/store/customers/edit/:path*', '/store/:path*', '/login', '/admin'],
}
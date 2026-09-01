import { verifyAuth } from './app/middlewares/auth.js'
import { redirectIfLoggedIn } from './app/middlewares/public.js'
import { checkAuthorization, checkAdmin, checkOwner } from './app/middlewares/authorization.js'
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
                          '/api/export',
                        ]
  const ownerPaths = ['/store/staff']
  const adminPaths = ['/admin']

  if(publicPaths.some((path) => pathname.startsWith(path))) {
    // If the user is logged in, redirect them to the dashboard
    return redirectIfLoggedIn(request)
  }

  if(authorizePaths.some((path) => pathname.startsWith(path))) {
    return checkAuthorization(request)
  }

  if(ownerPaths.some((path) => pathname.startsWith(path))) {
    return checkOwner(request)
  }

  if(adminPaths.some((path) => pathname.startsWith(path))) {
    return checkAdmin(request)
  }

  if(privatePaths.some((path) => pathname.startsWith(path))) {
    return verifyAuth(request)
  }

  
}

export const config = {
    matcher: ['/store/customers/edit/:path*', '/store/:path*', '/login', '/admin:path*'],
}
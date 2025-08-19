import { redirect } from 'next/dist/server/api-utils/index.js';
import { verifyAuth } from './app/middlewares/auth.js'
import { redirectIfLoggedIn } from './app/middlewares/public.js'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  const publicPaths = ["/login", "/register"];
  const privatePaths = ["/dashboard", "/inventory", "/orders", "/products"]

   if(publicPaths.some((path) => pathname.startsWith(path))) {
    // If the user is logged in, redirect them to the dashboard
    return redirectIfLoggedIn(request)
  }

  if(privatePaths.some((path) => pathname.startsWith(path))) {
    return verifyAuth(request)
  }


}

export const config = {
    matcher: ['/dashboard/:path*', '/inventory/:path*', '/orders/:path*', '/products/:path*', '/login', '/register'],
}
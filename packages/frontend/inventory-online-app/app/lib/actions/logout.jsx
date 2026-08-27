'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Logs the current user out. The session is a pair of stateless JWTs stored in httpOnly
 * cookies (access_token + refresh_token — see login.jsx / SecurityController.login) —
 * there is no server-side session to invalidate, so logging out is simply deleting both
 * cookies and sending the user back to the login screen. Deleting refresh_token too is
 * what makes this a real logout — without it, the middleware's silent refresh (see
 * app/middlewares/session.js) would just log the user back in on their next request.
 */
export default async function LogoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
    redirect('/login')
}

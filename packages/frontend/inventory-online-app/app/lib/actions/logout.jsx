'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Logs the current user out. The session is a stateless JWT stored in an httpOnly cookie
 * (see login.jsx / SecurityController.login) — there is no server-side session to
 * invalidate, so logging out is simply deleting that cookie and sending the user back
 * to the login screen.
 */
export default async function LogoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    redirect('/login')
}

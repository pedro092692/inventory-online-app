'use server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyToken } from '@/app/utils/verifyToken'
import checkNextParam from '@/app/utils/checkNextParam'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function Login(nextUrl, prevState, formData) {
    const safeNext = checkNextParam(nextUrl)
    const email = formData.get('email')
    const password = formData.get('password')
    const invalidCredentialsError = 'Usuario o contraseña incorrectos'
    const endpoint = '/api/security/login'
    const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`
    const body = {
        email: email, 
        password: password
    }

    if (!email || !password) {
        return {
            message: null,
            erorr: invalidCredentialsError,
            inputs: body
        }
    }

    const response = await fetch( url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : null
    })

    if (response.ok) {
        // getSetCookie() returns each Set-Cookie header separately — the backend now sets
        // TWO cookies (access_token + refresh_token, see SecurityController.login), and the
        // older .get('set-cookie') would merge them into one comma-joined string and break
        // this parsing.
        const setCookies = typeof response.headers.getSetCookie === 'function'
            ? response.headers.getSetCookie()
            : []

        const cookieMaxAges = {
            access_token: 3600,
            refresh_token: 3600 * 24 * 7
        }

        let accessTokenValue = null
        const cookieStore = await cookies()

        for (const rawCookie of setCookies) {
            const [pair] = rawCookie.split(';')
            const eqIdx = pair.indexOf('=')
            const name = pair.slice(0, eqIdx).trim()
            const value = pair.slice(eqIdx + 1)

            if (!(name in cookieMaxAges)) continue

            if (name === 'access_token') {
                accessTokenValue = value
            }

            cookieStore.set(name, value, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: cookieMaxAges[name],
            })
        }

        if (accessTokenValue) {
            // get current user role
            const response_cu = await verifyToken(accessTokenValue)
            const current_user = await response_cu.json()

            if(current_user.data.role_name === 'admin' && safeNext === '/store') {
                redirect('/admin')
            }


            redirect(safeNext)
        }
    }
    
    if (!response.ok) {
        if (response.status === 401) {
            return {
                message: null,
                error: invalidCredentialsError,
                inputs: body
            }
    
        }
        
        return {
            message: null,
            error: 'Hubo un error inesperado intenta nuevamente',
            inputs: body
        }
    }
 
}   
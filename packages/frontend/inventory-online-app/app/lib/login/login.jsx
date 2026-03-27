'use server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function Login(prevState, formData) {
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
        const setCookie = response.headers.get('set-cookie')
        if (setCookie) {
            const tokenPart = setCookie.split(';')[0]
            const [name, value] = tokenPart.split('=')
            const cookieStore = await cookies()
            cookieStore.set(name.trim(), value, {
                httpOnly: true,
                secure: true, 
                sameSite: 'strict',
                maxAge: 3600,
            })

            redirect('/store')
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
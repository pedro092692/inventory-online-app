import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { NotfoundError } from '@/app/errors/NotFoundError'
export default async function FetchData(url, method, body = null) {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    const isFormData = body instanceof FormData
    // await new Promise (resolve => setTimeout(resolve, 100))
    if (!token) {
       redirect(await buildLoginUrl())
    }
    const response = await fetch(url, {
        method: method,
        headers: {
            'Cookie': `access_token=${token}`,
            ...(isFormData ? {} : {'Content-Type': 'application/json'} 
            )
        },
        body: body
            ? isFormData
                ? body
                : JSON.stringify(body)
            : null
    })
    
    const text = await response.text()
    const data = text ? JSON.parse(text) : null
    
    if (!response.ok) {
        if (response.status === 500){
            throw new Error('Something went wrong')
        }

        if (response.status === 404) {
            throw new NotfoundError('Not found')
        }
    
        return {
            errors: data?.errors || data?.message || data?.error ||  'Something went wrong'
        }
    }
    
    return data

}

async function buildLoginUrl() {
    const headersList = await headers()
    const referer = headersList.get('referer')
    const next = referer ? new URL(referer).pathname : '/'
    return `/login?next=${encodeURIComponent(next)}`
}
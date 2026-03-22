import { cookies } from 'next/headers'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
export default async function FetchData(url, method, body = null) {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    // await new Promise (resolve => setTimeout(resolve, 100))
    if (!token) {
        return null
    }
    
    const response = await fetch(url, {
        method: method,
        headers: {
            'Cookie': `access_token=${token}`,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null
    })
    
    const data = await response.json()

    if (!response.ok) {
        if (response.status === 500){
            throw new Error('Something went wrong')
        }

        if (response.status === 404) {
            throw new Error('Not found')
        }
    
        return {
            errors: data?.errors || data?.message || data?.error ||  'Something went wrong'
        }
    }
    
    return data

}
    
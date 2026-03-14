import { cookies } from 'next/headers'

export default async function FetchDataTest(url, method, body = null) {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    await new Promise (resolve => setTimeout(resolve, 1000))
    if (!token) {
        return null
    }

    const response = await fetch(url, {
        method,
        headers: {
            'Cookie': `access_token=${token}`,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null
        
    })
  

    if (!response.ok) {
        throw { status: response.status, message: 'Somthing went wrong' }
    }

    return response.json()
    
}
    
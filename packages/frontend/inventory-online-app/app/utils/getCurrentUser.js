import { cookies } from 'next/headers'
import { verifyToken } from './verifyToken'

export async function getCurrentUser() {
     const cookieStore = await cookies()
     const token = cookieStore.get('access_token')?.value
     if (!token) {
        return null
     }
     const userInfo = await verifyToken(token, true)
     return userInfo.data
}

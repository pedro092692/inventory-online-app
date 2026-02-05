import getData from '@/app/utils/fetchData'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export async function getUser() {
    const currentUser = getData(`${NEXT_PUBLIC_API_BASE_URL}/api/security/current-user`, 'GET')
    return currentUser
}

 
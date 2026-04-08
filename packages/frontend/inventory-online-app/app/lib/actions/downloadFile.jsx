'use server'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function DownloadFileAction(
        endpoint, 
        preStave, formData) {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) {
           redirect(await buildLoginUrl())
    }
    const url = `${NEXT_PUBLIC_API_BASE_URL}/api/${endpoint}`

    const buffer =await fetch(url, {
        method: 'POST',
        headers: {
            'Cookie': `access_token=${token}`,
        },
    })
    

    return new File([buffer], "productos.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })
 }

 async function buildLoginUrl() {
    const headersList = await headers()
    const referer = headersList.get('referer')
    const next = referer ? new URL(referer).pathname : '/'
    return `/login?next=${encodeURIComponent(next)}`
}
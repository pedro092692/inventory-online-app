'use server'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
export async function downloadProductFile() {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
           redirect(await buildLoginUrl())
    }

    const url = `${NEXT_PUBLIC_API_BASE_URL}/api/products/export`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Cookie': `access_token=${token}`
        }
    })

    if(!response.ok) {
        throw new Error('Error al descargar el archivo')
    }
    
    const blob = await response.blob()
    const urlBlob = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = urlBlob
    link.download = 'products.xlsx'
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(urlBlob)
    link.remove()

}

async function buildLoginUrl() {
    const headersList = await headers()
    const referer = headersList.get('referer')
    const next = referer ? new URL(referer).pathname : '/'
    return `/login?next=${encodeURIComponent(next)}`
}
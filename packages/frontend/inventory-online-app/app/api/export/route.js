import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if(!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/export`

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Cookie': `access_token=${token}`
            }
        })
        if(!response.ok) {
            throw new Error('Error al descargar el archivo')
        }
        const buffer = await response.arrayBuffer()

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=products.xlsx'
            }
        })
    }catch(error){
        throw new Error('Error al descargar el archivo')
    }
}
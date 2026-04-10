import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if(!token) {
        return NextResponse.json({ error: 'FORBIDDEN' }, { status: 401 })
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
            if(response.status === 403) {
                return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
            }

            return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
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
        return NextResponse.json({ error: 'FECTCH_FALIED' }, { status: 500 })
    }
}
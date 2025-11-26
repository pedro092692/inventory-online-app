'use client'
import fetchData from '@/app/utils/fetchData'
import { useEffect, useState } from 'react'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function CustomerDetail() {
    const [customer, setCustomer] = useState(null)

    const data = async () => {
        const constumer = await fetchData(`${NEXT_PUBLIC_API_BASE_URL}/api/customers/6`, 'GET')
        setCustomer(constumer)
    }
    useEffect(() => {
        data()
    }, [])
    
    return (
        <>
        aqui la info del cliente
        </>
    )
}
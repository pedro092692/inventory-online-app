'use client'
import { useEffect, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import axios from 'axios'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function ViewCustomers() {

    const [customers, setCustomers ] = useState([])
    // load customers from the API
    useEffect(() => {
        const fetchCustomeers = async () => {
            try {
                const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/api/customers/all`, {withCredentials: true})
                if (response.data) {
                    setCustomers(response.data)
                }
            } catch (error) {
                if (error.response) {
                    console.log(error.response.status)
                    console.log(error.response.data.message)
                }
            }
        }

        fetchCustomeers()
    }, [])

    return (
        <>
            {/* view all customers */}
            <h1>Lista de todos los clientes</h1>
            <Container
                padding="0"
                direction="column"
                justifyContent="start"
                alignItem="start"
                backgroundColor="grey"
                flexGrow="1"
                width="100%"
            >
                <ul>
                    {customers.map((customer) => (
                        <li key={customer.id}>{customer.name}</li>
                    ))}
                </ul>
            </Container>
        </>
    )
}
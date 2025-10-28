'use client'
import { useEffect, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import axios from 'axios'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function ViewCustomers() {

    const [customers, setCustomers ] = useState([])
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(0)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    // load customers from the API
    const fetchCustomers = async (limit, offset) => {
            try {
                const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/api/customers/all?limit=${limit}&offset=${offset}`, 
                    {withCredentials: true})
                if (response.data) {
                    setCustomers(response.data.customers)
                    setPage(response.data.page)
                    setTotal(response.data.total)
                }
            } catch (error) {
                if (error.response) {
                    console.log(error.response.status)
                    console.log(error.response.data.message)
                }
            }
        }

    useEffect(() => {
        fetchCustomers(limit, offset)
    }, [])

    return (
        <>
            {/* view all customers */}
            <Route path='customers' endpoints={['default', 'view']} /> 
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
                <p>Total: {total}</p>
                <p>Page: {page} </p>
            </Container>
        </>
    )
}
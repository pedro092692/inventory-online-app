'use client'
import { useEffect, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import axios from 'axios'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function ViewCustomers() {

    const [customers, setCustomers ] = useState([])
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(0)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    // load customers from the API
    const fetchCustomers = async (limit, offset) => {
            setLoading(true)
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
            } finally {
                setLoading(false)
            }
        }

    //load customers on component mount
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
                // backgroundColor="grey"
                flexGrow="1"
                width="100%"
            >   
                {loading ? 
                    <p>Cargando clientes...</p>
                : customers.length === 0 ?
                    <p>No hay clientes disponibles</p> 
                :
                <>
                    <table border={'1'}>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cedula</th>
                                <th>Telefono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{customer.name}</td>
                                        <td>{customer.id_number}</td>
                                        <td>{customer.phone.replace('+58', '')}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <p>Total: {total}</p>
                    <p>Page: {page} </p>
                </>
                }
            </Container>
        </>
    )
}
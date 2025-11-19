'use client'
import { useEffect, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import Pagination from '@/app/ui/pagination/pagination'
import List from '@/app/ui/list/list'
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
    const [tableData, setTableData] = useState([])
    
    // load customers from the API
    const fetchCustomers = async (limit, offset) => {
            try {
                const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/api/customers/all?limit=${limit}&offset=${offset}`, 
                    {withCredentials: true})
                if (response.data) {
                    setCustomers(response.data.customers)
                    setPage(response.data.page)
                    setTotal(response.data.total)
                    setTableData(transformData(response.data.customers))
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
        setLoading(true)
        fetchCustomers(limit, offset)
    }, [])


    const transformData = (customers) => {
        let data = []
        if (customers.length > 0) {
            data = customers.map(customer => (
                [customer.name, customer.id_number, customer.phone.replace('+58', '')]
            ))
        }
        return data
    }
    
    const totalPages = Math.ceil(total / limit)
    const currentPage = page
    const maxVisiblePages = 8 
        
    const handlePageChange = (pageNumber) => {
        setOffset((pageNumber - 1) * limit)
        fetchCustomers(limit, (pageNumber - 1) * limit)
    }


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
                    <p>No hay clientes disponibles.</p> 
                :
                <>  
                    <List tableHead={['Nombre', 'Cedula', 'Telefono', 'Acciones']} tableData={tableData}   />
                    
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        maxVisiblePages={maxVisiblePages}
                        onPageChange={handlePageChange}
                    />
                </>
                }
            </Container>
        </>
    )
}
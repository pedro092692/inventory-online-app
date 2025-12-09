'use client'
import { useEffect, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import Pagination from '@/app/ui/pagination/pagination'
import List from '@/app/ui/list/list'
import Route from '@/app/ui/routesLinks/routes'
import axios from 'axios'
import GetPageParam from '@/app/utils/getPageParam'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function ViewCustomers() {
    
    const [customers, setCustomers ] = useState([])
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(GetPageParam() * limit)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [tableData, setTableData] = useState([])
    const [actions, setActions] = useState([])
    
    
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
                    setActions(response.data.actions)
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
                {
                    name: customer.name,
                    id_number: customer.id_number,
                    phone: customer.phone.replace('+58', ''),
                    id: customer.id,
                }
            ))
        }
        return data
    }
    
    const totalPages = Math.ceil(total / limit)
    const currentPage = page
    const maxVisiblePages = 8 

    return (
        <>
            {/* view all customers */}
            <Route path='customers' endpoints={['default', 'view']} /> 
            <Container
                padding="0"
                direction="column"
                justifyContent="start"
                alignItem="start"
                flexGrow="1"
                width="100%"
            >   
                {loading ? 
                    <p>Cargando clientes...</p>
                : customers.length === 0 ?
                    <p>No hay clientes disponibles.</p> 
                :
                <>  
                    <List tableHead={
                        {
                        'nombre': 'Nombre',
                        'cedula': 'Cédula',
                        'teléfono': 'Teléfono',
                        'actions': 'Acciones'
                        }
                    } 
                          tableData={tableData}  
                          actions={actions}
                    />
                    
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        maxVisiblePages={maxVisiblePages}
                        setOffet={setOffset}
                        limit={limit}
                        fetchData={fetchCustomers}
                    />
                </>
                }
            </Container>
        </>
    )
}
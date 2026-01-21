'use client'
import { useEffect, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import Pagination from '@/app/ui/pagination/pagination'
import List from '@/app/ui/list/list'
import Route from '@/app/ui/routesLinks/routes'
import axios from 'axios'
import GetPageParam from '@/app/utils/getPageParam'
import Search from '@/app/ui/form/search/search'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function ViewCustomers() {
    
    const [customers, setCustomers ] = useState([])
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(GetPageParam('page') * limit)
    const [dataSearch, setDataSearch] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [tableData, setTableData] = useState([])
    const [actions, setActions] = useState([])
    const [searchQuery, setSearchQuery] = useState(GetPageParam('search'))
    
    
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

    // search customers by name or id_number from the API
    const searchCustomers = async (query, limit, offset) => {
            if (!query) {
                fetchCustomers(10, 0)
                setDataSearch(false)
                setSearchQuery(null)
                return
            }
            try {
                const response = await axios.get(
                    `${NEXT_PUBLIC_API_BASE_URL}/api/customers/search?data=${query}&limitResults=${limit}&offsetResults=${offset}`, 
                    {withCredentials: true}
                )
                if (response.data) {
                    setCustomers(response.data.customers)
                    setPage(response.data.page)
                    setTotal(response.data.total)
                    setTableData(transformData(response.data.customers))
                    setDataSearch(true)
                    setSearchQuery(query)
                }
            }catch (error) {
                if (error.response) {
                    console.log(error.response.status)
                    console.log(error.response.data.message)
                }
            }finally {
                setLoading(false)
            }
        }

    //load customers on component mount
    useEffect(() => {
        setLoading(true)
        if (searchQuery) {
            searchCustomers(searchQuery, limit, offset)
            return
        }
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
                : customers.length === 0 && !dataSearch ?
                    <p>No hay clientes disponibles.</p> 
                :
                <>  
                    <Search placeHolder={'Buscar cliente por Nombre, Cédula'}
                        value={searchQuery}
                        searchFn={searchCustomers} 
                        limit={limit} 
                        offset={offset} 
                        setOffset={setOffset}
                    />
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
                          showActions={true}
                    />
                    
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        maxVisiblePages={maxVisiblePages}
                        setOffet={setOffset}
                        limit={limit}
                        fetchData={ dataSearch ? searchCustomers : fetchCustomers}
                        searchTerm={ dataSearch ? searchQuery : null}
                        param={'page'}
                    />
                </>
                }
            </Container>
        </>
    )
}
'use client'
import { useEffect, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import Pagination from '@/app/ui/pagination/pagination'
import List from '@/app/ui/list/list'
import Route from '@/app/ui/routesLinks/routes'
import GetQueryParam from '@/app/utils/getQueryParam'
import Search from '@/app/ui/form/search/search'
import fetchData from '@/app/utils/fetchData'
import { getUser } from '@/app/utils/getUser'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function ViewCustomers() {
    
    const [customers, setCustomers ] = useState([])
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(GetQueryParam('page', 'pagination') * limit )
    const [dataSearch, setDataSearch] = useState(false)
    const [tableData, setTableData] = useState([])
    const [searchQuery, setSearchQuery] = useState(GetQueryParam('search') || '')
    const [currentUser, setCurrentUser] = useState({permissions: []})
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [maxVisiblePages, setMaxVisiblePages] = useState(8)
    
    // load customers from the API
    const fetchCustomers = async (limit, offset) => {
            try {
                const customers = await fetchData(`${NEXT_PUBLIC_API_BASE_URL}/api/customers/all?limit=${limit}&offset=${offset}`)
                if (customers) {
                    setCustomers(customers.customers)
                    setTableData(transformData(customers.customers))
                    updatePagination(customers.total, limit, customers.page)
                }
            } catch (error) {
                if (error.response) {
                    console.log(error.response.status)
                    console.log(error.response.message)
                }else{
                    console.log(error.status)
                    console.log(error.message)
                }
                
            } finally {
                setLoading(false)
            }
        }
    // search customers by name or id_number from the API
    const searchCustomers = async (query, limit, offset) => {
            if (!query) {
                fetchCustomers(limit, 0)
                setDataSearch(false)
                setSearchQuery(null)
                return
            }
            try {
                const searchResults = await fetchData(`${NEXT_PUBLIC_API_BASE_URL}/api/customers/search?data=${query}&limitResults=${limit}&offsetResults=${offset}`, 'GET')
        
                if(searchResults) {
                    setCustomers(searchResults.customers)
                    setTableData(transformData(searchResults.customers))
                    setDataSearch(true)
                    setSearchQuery(query)
                    updatePagination(searchResults.total, limit, searchResults.page)
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
    
    // get current user info
    const currentUserInfo = async () => {
        const user = await getUser()
        setCurrentUser(user)
    }

    // transform data 
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

    const updatePagination = (total, limit, currentPage) => {
        setTotalPages(Math.ceil(total / limit))
        setCurrentPage(currentPage)
        
    }
    
    //load customers on component mount
    useEffect(() => {
        setLoading(true)
        currentUserInfo()
        if (searchQuery) {
            searchCustomers(searchQuery, limit, offset)
            return
        }
        fetchCustomers(limit, offset)
    }, [])

    return (
        <>
            {/* view all customers */}
            <Route path='customers' endpoints={['default', 'view']} /> 
            <Container listContiner={true}>   
                {loading ? 
                    <p>Cargando clientes...</p>
                : customers.length === 0 && !dataSearch ?
                    <p>No hay clientes disponibles.</p> 
                :
                <>  
                    <Search 
                        placeHolder={'Buscar cliente por Nombre, Cédula'}
                        searchFn={searchCustomers} 
                        queryValueParam={searchQuery}
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
                          showActions={true}
                          currentUser={currentUser}
                          variableName={'customerId'}
                          setTableData={setTableData}
                    />
                    
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        maxVisiblePages={maxVisiblePages}
                        setOffset={setOffset}
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
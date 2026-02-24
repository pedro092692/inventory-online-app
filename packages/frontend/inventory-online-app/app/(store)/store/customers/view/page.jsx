'use client'
import { useEffect, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import Pagination from '@/app/ui/pagination/pagination'
import List from '@/app/ui/list/list'
import Route from '@/app/ui/routesLinks/routes'
import GetQueryParam from '@/app/utils/getQueryParam'
import Search from '@/app/ui/form/search/search'
import { errorHandler } from '@/app/errors/fetchDataErrorHandler'
import { updatePagination } from '@/app/utils/updatePagination'
import fetchData from '@/app/utils/fetchData'
import { getUser } from '@/app/utils/getUser'
import styles from './list.module.css'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function ViewCustomers() {

    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(GetQueryParam('page', 'pagination') * limit )
    const [tableData, setTableData] = useState([])
    const [isSearchActive, setIsSearchActive] = useState(false)
    const [searchQuery, setSearchQuery] = useState(GetQueryParam('search') || '')
    const [userPermission, setUserPermission] = useState({permissions: []})
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [maxVisiblePages, setMaxVisiblePages] = useState(8)
    
    // load customers from the API
    const fetchCustomers = async (limit, offset, query = null) => {
        const enpoint = query ? '/api/customers/search' : '/api/customers/all'
        const params = new URLSearchParams()
        if (query){
            params.append('data', query)
            params.append('limitResults', limit)
            params.append('offsetResults', offset)
        }else{
            params.append('limit', limit)
            params.append('offset', offset)
        
            setIsSearchActive(false)
            setSearchQuery(null)
        }
        const url = `${NEXT_PUBLIC_API_BASE_URL}${enpoint}?${params.toString()}`
        return await errorHandler( async () => {
            const data = await fetchData(url, 'GET')
            if (data) {
                    setTableData(transformData(data.customers))
                    updatePagination(setTotalPages, setCurrentPage, data.total, limit, data.page)
                    if (query) {
                        setIsSearchActive(true)
                        setSearchQuery(query)
                    }
            }   
        }, setLoading)
    }
   
    // get current user info
    const currentUserInfo = async () => {
        const user = await getUser()
        setUserPermission(user.permissions)
    }

    // transform data 
    const transformData = (customers) => {
        let data = []
        if (customers.length > 0) {
            data = customers.map(customer => (
                {
                    name: customer.name,
                    id_number: new Intl.NumberFormat('es-Ve').format(customer.id_number),
                    phone: customer.phone.startsWith('+5804') ? 
                        `${customer.phone.slice(3 ,7)}-${customer.phone.slice(7, 10)}-${customer.phone.slice(10, 12)}-${customer.phone.slice(12)}` 
                            : customer.phone,
                    id: customer.id,
                }
            ))
        }
        return data
    }

    
    //load customers on component mount
    useEffect(() => {
        setLoading(true)
        currentUserInfo()
        if (searchQuery) {
            fetchCustomers(limit, offset, searchQuery)
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
                : tableData.length === 0 && !isSearchActive ?
                    <p>No hay clientes disponibles.</p> 
                :
                <>  
                    <Search 
                        placeHolder={'Buscar cliente por Nombre, Cédula'}
                        searchFn={fetchCustomers} 
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
                          userPermission={userPermission}
                          deletionID={'customerId'}
                          setTableData={setTableData}
                          urlPath={'customers'}
                          customClass={styles.table}
                    />
                    
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        maxVisiblePages={maxVisiblePages}
                        setOffset={setOffset}
                        limit={limit}
                        fetchDataFn={ fetchCustomers}
                        searchTerm={ isSearchActive ? searchQuery : null}
                        param={'page'}
                    />
                </>
                }
            </Container>
        </>
    )
}
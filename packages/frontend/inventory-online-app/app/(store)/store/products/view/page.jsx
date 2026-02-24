'use client'
import { useEffect, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import Pagination from '@/app/ui/pagination/pagination'
import Link from 'next/link'
import List from '@/app/ui/list/list'
import GetPageParam from '@/app/utils/getQueryParam'
import GetQueryParam from '@/app/utils/getQueryParam'
import fetchData from '@/app/utils/fetchData'
import Search from '@/app/ui/form/search/search'
import { errorHandler } from '@/app/errors/fetchDataErrorHandler'
import { updatePagination } from '@/app/utils/updatePagination'
import { getUser } from '@/app/utils/getUser'
import Route from '@/app/ui/routesLinks/routes'
import styles from './page.module.css'

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'


export default function ViewProducts() {
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(GetPageParam('page', 'pagination') * limit)
    const [maxVisiblePages, setMaxVisiblePages] = useState(8)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [tableData, setTableData] = useState([])
    const [isSearchActive, setIsSearchActive] = useState(false)
    const [searchQuery, setSearchQuery] = useState(GetQueryParam('search') || '')
    const [userPermission, setUserPermission] = useState({permissions: []})
    const [tableHead, setTableHead] = useState({
        nombre: 'Nombre',
        barcode: 'Código De Barras',
        purchase_price: 'Precio de compra $',
        selling_price: 'Precio De Venta $',
        selling_price_bs: 'Precio De Venta Bs',
        stock: 'Stock',
        actions: 'Acciones'
    })

    
    // load products from the API
    const fetchProducts = async (limit, offset, query = null) => {
        // load user permission 
        const userPermission = await currentUserInfo(true)
        const enpoint = query ? '/api/products/search' : '/api/products/all'
        const params = new URLSearchParams()
        if (query) {
            params.append('data', query)
        }else{
            setIsSearchActive(false)
            setSearchQuery(null)
        }
        params.append('limit', limit)
        params.append('offset', offset)
        const url = `${NEXT_PUBLIC_API_BASE_URL}${enpoint}?${params.toString()}`
        
        return await errorHandler( async () => {
            const data = await fetchData(url, 'GET')
            if (data) {
                setTableData(transformData(data.products, userPermission.includes('update') ? true : false))
                updatePagination(setTotalPages, setCurrentPage, data.total, limit, data.page)
                if (query) {
                    setIsSearchActive(true)
                    setSearchQuery(query)
                }
            }
        }, setLoading)
    }

    const transformData = (products, inclucePurchasePrice = false) => {
        let data = []
        if (products.length > 0) {
            data = products.map(product => (
                {
                    name: product.name,
                    barcode: product.barcode,
                    purchase_price: `${product.purchase_price} $`,
                    selling_price: `${product.selling_price} $`,
                    selling_price_bs: `${product.reference_selling_price} Bs`,
                    stock: product.stock,
                    id: product.id
                }
            ))
            
            if (!inclucePurchasePrice){
                data.map((item) => {
                    delete item.purchase_price
                })
                delete tableHead.purchase_price
            }
            
        }
        return data
    }

    // get current user info
    const currentUserInfo = async (returnData = false) => {
        const user = await getUser()
        setUserPermission(user.permissions)
        return returnData ? user.permissions : null
        
    }

    useEffect(() => {
        setLoading(true)
        currentUserInfo()
        if (searchQuery) {
            fetchProducts(limit, offset, searchQuery)
            return
        }
        fetchProducts(limit, offset)
    }, [])
    
  return (
    <>
        {/* view all customers */}
        <Route path='products' endpoints={['default', 'view']} />
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
                <p>Cargando productos...</p>
            :  tableData.length === 0 && !isSearchActive ?
                <p>No hay productos para mostrar, <Link href={'/store/products/add'}>Agrega un nuevo producto</Link></p>
            :
                <>
                    <Search 
                        placeHolder={'Buscar producto por Nombre, Código De Barras'}
                        searchFn={fetchProducts} 
                        queryValueParam={searchQuery}
                        limit={limit} 
                        offset={offset} 
                        setOffset={setOffset}
                    />
                    <List 
                        tableHead={tableHead} 
                        tableData={tableData} 
                        showActions={ userPermission.includes('update') ? true : false }
                        customClass={styles.table}
                        userPermission={userPermission}
                        showView={false}
                    />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            maxVisiblePages={maxVisiblePages}
                            setOffset={setOffset}
                            limit={limit}
                            fetchDataFn={ fetchProducts }
                            searchTerm={ isSearchActive ? searchQuery : null}
                            param={'page'}
                        />
                        
                </>
            }

        </Container>
    </>
  )
}



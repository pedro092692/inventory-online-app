'use client'
import { useEffect, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import Pagination from '@/app/ui/pagination/pagination'
import Link from 'next/link'
import List from '@/app/ui/list/list'
import GetPageParam from '@/app/utils/getQueryParam'
import fetchData from '@/app/utils/fetchData'
import { errorHandler } from '@/app/errors/fetchDataErrorHandler'
import { updatePagination } from '@/app/utils/updatePagination'
import Route from '@/app/ui/routesLinks/routes'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'


export default function ViewProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(GetPageParam('page', 'pagination') * limit)
    const [maxVisiblePages, setMaxVisiblePages] = useState(8)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [dataTable, setDataTable] = useState([])

    
    // load products from the API
    const fetchProducts = async (limit, offset) => {
        const enpoint = '/api/products/all'
        const params = new URLSearchParams()
        params.append('limit', limit)
        params.append('offset', offset)
        const url = `${NEXT_PUBLIC_API_BASE_URL}${enpoint}?${params.toString()}`
        return await errorHandler( async () => {
            const data = await fetchData(url, 'GET')
            if (data) {
                setProducts(data.products)
                setDataTable(transformData(data.products))
                updatePagination(setTotalPages, setCurrentPage, data.total, limit, data.page)
            }
        }, setLoading)
    }

    const transformData = (products) => {
        let data = []
        if (products.length > 0) {
            data = products.map(product => (
                {
                    name: product.name,
                    barcode: product.barcode,
                    purchase_price: product.purchase_price,
                    selling_price: product.selling_price,
                    stock: product.stock,
                    id: product.id
                }
            ))
        }
        return data
    }

    useEffect(() => {
        setLoading(true)
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
            : products.length === 0 ?
                <p>No hay productos para mostrar, <Link href={'/store/products/add'}>Agrega un nuevo producto</Link></p>
            :
                <>
                    <List 
                        tableHead={
                            {
                                'nombre': 'Nombre',
                                'barcode': 'Código De Barras',
                                'purchase_price': 'Precio De Compra',
                                'selling_price': 'Precio De Venta',
                                'stock': 'Stock',
                                'actions': 'Acciones'
                            }
                        } 
                        tableData={dataTable} 
                        showActions={true}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            maxVisiblePages={maxVisiblePages}
                            setOffset={setOffset}
                            limit={limit}
                            fetchDataFn={ fetchProducts }
                            searchTerm={fetchProducts}
                            param={'page'}
                        />
                        
                </>
            }

        </Container>
    </>
  )
}



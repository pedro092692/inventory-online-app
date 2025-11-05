'use client'
import { useEffect, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import Link from 'next/link'
import List from '@/app/ui/list/list'
import Route from '@/app/ui/routesLinks/routes'
import axios from 'axios'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'


export default function ViewProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(0)
    const [total, setTotal]  = useState(0)
    const [page, setPage] = useState(0) 

    
    // load products from the API
    const fetchProducts = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/api/products/all`, {withCredentials: true})
            if(response.data){
                setProducts(response.data);
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.status)
                console.log(error.response.data.message)
            }
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])
    
    let data = []

    if (products.length > 0) {
        data = products.map(product => (
            [product.name, product.selling_price + ' $', product.stock]
        ))
    }

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
                    <List tableHead={['Nombre', 'Precio', 'Stock']} tableData={data} />
                    <p>Total: {total}</p>
                    <p>Page: {page} </p>
                </>
            }

        </Container>
    </>
  )
}



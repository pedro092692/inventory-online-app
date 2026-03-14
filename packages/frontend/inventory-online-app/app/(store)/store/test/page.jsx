import Customers2 from '@/app/ui/customers/all/customers2'
import Customers from '@/app/ui/customers/all/customer'
import SearchTest from '@/app/ui/customers/componentes/search'
import { Suspense } from 'react'
import FetchDataTest from '@/app/utils/fetch'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'
export default async function CustomersTest( { searchParams } ) {
    const params = await searchParams
    const query = params.data ? params.data : null
    const page = params.page || 1
    const limit = 10
    const offset = (page - 1) * limit

    const enpoint = query ? '/api/customers/search' : '/api/customers/all'
    const para = new URLSearchParams()
    if (query) {
        para.append('data', query)
        para.append('limitResults', limit)
        para.append('offsetResults', offset)
    }else {
        para.append('limit', limit)
        para.append('offset', offset)
    }
    const url = `${NEXT_PUBLIC_API_BASE_URL}${enpoint}?${para.toString()}`
    const response = await FetchDataTest(url, 'GET')
    const customers = response.customers

    return (
        <>
            <SearchTest />
            <Suspense key={query} fallback={<p>Cargando clientes...en page</p>}>
                <Customers2 
                    customers={customers}
                />
                {/* <Customers 
                    query={query}
                /> */}
            </Suspense>
        </>
    )
}
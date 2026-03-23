import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import Search from '@/app/ui/form/search/search'
import Pagination from '@/app/ui/pagination/pagination'
import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import Customers from './_components/customers'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function Customer({searchParams}) {
    const params = await searchParams
    const query = params?.data || null
    const currentPage = Number(params?.page) || 1
    const fetch = withErrorHandler(FetchData, 'Hubo un error inesperado intententa nuevamente')
    const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/customers/total-pages${query ? `?data=${query}` : '' }`, 'GET')
    const {data, error} = response 
    const totalPages = data?.total || 1
    
    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
        
            <Route path='customers' endpoints={['add', 'default']} /> 
            <Search 
                placeHolder="Buscar cliente por Nombre, Cédula"
            />
            <Suspense key={query + currentPage} fallback={<ListSkeleton nTitle={4} />}>
                <Customers page={currentPage} query={query} />
            </Suspense>
            
            {
                error ? 
                (    
                    <p className='p2-r errorMsg'>{error}</p>
                ) 
                : 
                (
                    <Pagination totalPages={totalPages} />
                )
            }
            
        </Container>
       
    )
}
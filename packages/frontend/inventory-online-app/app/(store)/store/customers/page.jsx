import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import Search from '@/app/ui/form/search/search'
import Pagination from '@/app/ui/pagination/pagination'
import Request from '@/app/utils/request'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import Customers from './_components/customers'
import { buildQueryParams } from '@/app/utils/buildQueryParams'

export default async function Customer({searchParams}) {
    const params = await searchParams
    const query = params?.data || null
    const sortBy = params?.sortBy || null
    const sortDir = params?.sortDir || null
    const queryString = buildQueryParams(params, ['page', 'data', 'sortBy', 'sortDir'])
    const currentPage = Number(params?.page) || 1
    const response = await Request(`customers/total-pages${query ? `?data=${query}` : ''}`, 'GET', null, 'Hubo un error inesperado intententa nuevamente')
    const {data, error} = response 
    const totalPages = data?.total || 1
    const all = data?.all || false
    
    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
        
            <Route path='customers' endpoints={['add', 'default']} queryString={queryString} /> 
            {all > 0 && <Search 
                placeHolder="Buscar cliente por Nombre, Cédula"
            />}
            <Suspense key={query + currentPage} fallback={<ListSkeleton nTitle={4} />}>
                <Customers page={currentPage} query={query} queryString={queryString} sortBy={sortBy} sortDir={sortDir}/>
            </Suspense>
            
            {
                error ? 
                (    
                    <p className='p2-r errorMsg'>{error}</p>
                ) 
                : 
                (
                    data?.total > 0 && <Pagination totalPages={totalPages} />
                )
            }
            
        </Container>
       
    )
}
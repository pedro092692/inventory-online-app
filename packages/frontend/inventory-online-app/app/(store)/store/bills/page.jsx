import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import Search from '@/app/ui/form/search/search'
import Pagination from '@/app/ui/pagination/pagination'
import GetItemAction from '@/app/lib/actions/get'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import { buildQueryParams } from '@/app/utils/buildQueryParams'

export default async function Bills({searchParams}) {
   const params = await searchParams
   const query = params?.data || null
   const queryString = buildQueryParams(params, ['page', 'data'])
   const currentPage = Number(params?.page) || 1
   const response = await GetItemAction(`invoices/total-pages${query ? `?data=${query}` : '' }`, 'Hubo un error inesperado intenta nuevamente')
   const { data, error } = response || {}
   const totalPages = data?.total || 1
    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
            <Route path='bills' endpoints={['add', 'default']} queryString={queryString}/>
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
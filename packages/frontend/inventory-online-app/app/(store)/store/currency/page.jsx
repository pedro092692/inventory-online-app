import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import Pagination from '@/app/ui/pagination/pagination'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import GetItemAction from '@/app/lib/actions/get'
import { buildQueryParams } from '@/app/utils/buildQueryParams'

export default async function Currency({searchParams}) {
    const params = await searchParams
    const currentPage = Number(params?.page) || 1
    const queryString = buildQueryParams(params, ['page'])
    const response = await GetItemAction(`dollar-value/total-pages`, 'Hubo un error inesperado intenta nuevamente')
    const {data, error} = response 
    const totalPages = data?.total || 1
    
    return (
        <Container
              direction={'column'}
              alignItem={'start'}
              padding='0px'
              width='100%'
        >
            <Route path='currency' endpoints={['add', 'default']} queryString={queryString} /> 
            <Suspense key={currentPage} fallback={<ListSkeleton nTitle={7} />}>
                              {/* <Products page={currentPage} query={query} queryString={queryString}/> */}
            </Suspense>
            {
                error ? 
                (    
                    <p className='p2-r errorMsg'>{error}</p>
                )
                :
                <Container
                    padding={'0px'}
                    width={'100%'}
                    justifyContent={'space-between'}
                >
                    <Pagination totalPages={totalPages} />
                </Container>
            }
        </Container>
    )
}
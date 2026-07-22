import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import GetItemAction from '@/app/lib/actions/get'

export default async function Pyaments() {
    
    // const response = await GetItemAction(`dollar-value/total-pages`, 'Hubo un error inesperado intenta nuevamente')
    // const {data, error} = response 
    const error = null
    
    return (
        <Container
              direction={'column'}
              alignItem={'start'}
              padding='0px'
              width='100%'
        >   
            
            <Route path='payments' endpoints={['default']} />
            {
                error ?
                (    
                    <p className='p2-r errorMsg'>{error}</p>
                )
                :
                <Suspense key={1} fallback={<ListSkeleton nTitle={3} />}>
                    {/* <Data page={currentPage} queryString={queryString}/> */}
                </Suspense>
                
            } 
        </Container>
    )
}
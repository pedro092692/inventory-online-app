import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import PyamentsInfo from '@/app/(store)/store/payment-methods/_components/payments'

export default async function Pyaments() {
    

    
    return (
        <Container
              direction={'column'}
              alignItem={'start'}
              padding='0px'
              width='100%'
        >   
            
            <Route path='payments' endpoints={['default']} />
            
            <Suspense key={1} fallback={<ListSkeleton nTitle={3} />}>
                <PyamentsInfo />
            </Suspense>
                
            
        </Container>
    )
}
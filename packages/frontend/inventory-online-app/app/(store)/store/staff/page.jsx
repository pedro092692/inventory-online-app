import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import Sellers from '@/app/(store)/store/staff/_components/sellers'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'

export default async function Cashiers() {
    
    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
            <Route path='staff' endpoints={['add', 'default']}  /> 
            <Suspense fallback={<ListSkeleton nTitle={4} />}>
                <Sellers />
            </Suspense>
        </Container>
    )
}
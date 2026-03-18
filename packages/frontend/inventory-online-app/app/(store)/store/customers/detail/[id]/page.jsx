import Route from '@/app/ui/routesLinks/routes'
import { Container } from '@/app/ui/utils/container'
import CustomerInfo from '@/app/(store)/store/customers/_components/detail/detail'
import { Suspense } from 'react'

export default async function CustomerDetail({ params }) {
    const { id } = await params
    
    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
            <Route path='customers' endpoints={['default', 'detail']} /> 

            <Suspense fallback={<p>Cargando...</p>}>
                <CustomerInfo id={id} />
            </Suspense>
           
       </Container>
    )
}


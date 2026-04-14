import Route from '@/app/ui/routesLinks/routes'
import { Container } from '@/app/ui/utils/container'
import { Suspense } from 'react'
import Request from '@/app/utils/request'
import { buildQueryParams } from '@/app/utils/buildQueryParams'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import BillInfo from '@/app/(store)/store/bills/_components/detail/detail'

export default async function BillDetail({ params, searchParams}) {
    const { id }  = await params
    const ulrParams = await searchParams
    const queryString = buildQueryParams(ulrParams, ['page', 'data'])
    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
            <Route path='bills' endpoints={['default', 'detail']} queryString={queryString}/> 
            
            <Suspense key={id} fallback={<FormSkeleton nFields={5}/>}>
                <BillInfo id={id}/>  
            </Suspense>
                   
        </Container>
    )
}
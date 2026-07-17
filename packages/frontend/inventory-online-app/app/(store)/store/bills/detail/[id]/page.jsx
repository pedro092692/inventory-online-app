import Route from '@/app/ui/routesLinks/routes'
import { Container } from '@/app/ui/utils/container'
import { Suspense } from 'react'
import { buildQueryParams } from '@/app/utils/buildQueryParams'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import BillInfo from '@/app/(store)/store/bills/_components/detail/detail'
import Request from '@/app/utils/request'

export default async function BillDetail({ params, searchParams}) {
    const { id }  = await params
    const ulrParams = await searchParams
    const page = Number(ulrParams?.pageProducts) || 1
    const queryString = buildQueryParams(ulrParams, ['page', 'data']) || ulrParams
    const response = await Request(`invoice-details/total-pages?id=${id}`, 'GET', null, 'Hubo un error inesperado intententa nuevamente')
    const {data, error} = response
    const totalProductPages = data?.total || 0

    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
            <Route path='bills' endpoints={ulrParams?.fromCustomer ? ['customer', 'detail'] : ['default', 'detail']} queryString={queryString}/> 
            <Suspense key={id} fallback={<FormSkeleton nFields={5} custonStyle={{width: '100% !important'}}/>}>
                <BillInfo id={id} queryString={queryString} page={page} totalProductPages={totalProductPages}/>  
            </Suspense>
                   
        </Container>
    )
}
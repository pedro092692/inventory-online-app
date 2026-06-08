import Route from '@/app/ui/routesLinks/routes'
import { Container } from '@/app/ui/utils/container'
import { Suspense } from 'react'
import { buildQueryParams } from '@/app/utils/buildQueryParams'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import ReturnedInvoiceProducts from '@/app/(store)/store/bills/_components/detail/returnedProducts/returnedProductDetail'
import Request from '@/app/utils/request'

export default async function ReturnedInvoiceDetail({ params, searchParams}) {
    const { id }  = await params
    const ulrParams = await searchParams
    const page = Number(ulrParams?.pageProducts) || 1
    const queryString = buildQueryParams(ulrParams, ['page', 'data'])
    const response = await Request(`invoice-returns/total-pages?id=${id}`, 'GET', null, 'Hubo un error inesperado intententa nuevamente')
    const {data, error} = response
    const totalProductPages = data?.total || 0
    
    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
            <Route path='bills' endpoints={['default', 'detail']} queryString={queryString}/> 
            <Suspense key={id} fallback={<FormSkeleton nFields={5} custonStyle={{width: '100% !important'}}/>}>
                <ReturnedInvoiceProducts id={id} page={page} totalProductPages={totalProductPages}/>  
            </Suspense>
                   
        </Container>
    )
}
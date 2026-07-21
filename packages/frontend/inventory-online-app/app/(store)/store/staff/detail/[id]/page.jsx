import Route from '@/app/ui/routesLinks/routes'
import { Container } from '@/app/ui/utils/container'
import SellerInfo from '@/app/(store)/store/staff/_components/detail/sellerdetail'
import { Suspense } from 'react'
import Request from '@/app/utils/request'
import { buildQueryParams } from '@/app/utils/buildQueryParams'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'

export default async function CustomerDetail({ params, searchParams }) {
    const { id } = await params
    const ulrParams = await searchParams
    const invoicePage = Number(ulrParams?.invoice_page) || 1
    const invoiceQuery = Number(ulrParams?.invoice) || null
    const queryString = buildQueryParams(ulrParams, ['page', 'data'])
    const response = await Request(`sellers/total-invoices?id=${id}`, 'GET', null, 'Hubo un error inesperado intententa nuevamente')
    const {data, error} = response
    const totalInvoicePages = data?.total || 0

   

    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
            <Route path='staff' endpoints={['default', 'detail']} queryString={queryString}/> 

            <Suspense key={id} fallback={<FormSkeleton nFields={3}/>}>
                <SellerInfo 
                    id={id} 
                    page={invoicePage}
                    invoiceQuery={invoiceQuery}
                    totalInvoicePages={totalInvoicePages}
                />
            </Suspense>
           
       </Container>
    )
}

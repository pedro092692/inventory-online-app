import Route from '@/app/ui/routesLinks/routes'
import { buildQueryParams } from '@/app/utils/buildQueryParams'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import InvoiceProductDetailInfo from '@/app/(store)/store/bills/_components/edit/invoiceProductDetailInfo'
import Request from '@/app/utils/request'
import { Suspense } from 'react'

export default async function EditProductInvoice({ params, searchParams }) {
    const { id } = await params
    const ulrParams = await searchParams
    const page = Number(ulrParams?.pageProducts) || 1
    const queryString = buildQueryParams(ulrParams, ['page', 'data'])
    const response = await Request(`invoice-details/total-pages?id=${id}`, 'GET', null, 'Hubo un error inesperado intententa nuevamente')
    const {data, error} = response
    const totalProductPages = data?.total || 0
    return (
        <>
            <Route path='bills' endpoints={['detail', 'editProduct']}  queryString={queryString} id={id}/>
            <Suspense key={id} fallback={<FormSkeleton nFields={5} custonStyle={{with: '100% !important'}}/>}>
               <InvoiceProductDetailInfo id={id} page={page} totalProductPages={totalProductPages} queryString={queryString}/>
            </Suspense>
        </>
    )
}
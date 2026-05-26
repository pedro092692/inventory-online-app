import Route from '@/app/ui/routesLinks/routes'
import { buildQueryParams } from '@/app/utils/buildQueryParams'
import InvoicePaymentInfo from '@/app/(store)/store/bills/_components/edit/invoicePaymentInfo'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import { Suspense } from 'react'

export default async function EditInvoice({ params, searchParams }) {
    const { id } = await params
    const ulrParams = await searchParams
    const queryString = buildQueryParams(ulrParams, ['page', 'data'])

    return (
        <>
            <Route path='bills' endpoints={['detail', 'edit']}  queryString={queryString} id={id}/>
            <Suspense key={id} fallback={<FormSkeleton nFields={5} custonStyle={{with: '100% !important'}}/>}>
                <InvoicePaymentInfo id={id}/>
            </Suspense>
        </>
    )
}
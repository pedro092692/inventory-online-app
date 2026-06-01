import Route from '@/app/ui/routesLinks/routes'
import { buildQueryParams } from '@/app/utils/buildQueryParams'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import { Suspense } from 'react'

export default async function EditInvoice({ params, searchParams }) {
    const { id } = await params
    const ulrParams = await searchParams
    const queryString = buildQueryParams(ulrParams, ['page', 'data'])

    return (
        <>
            <Route path='bills' endpoints={['detail', 'editProduct']}  queryString={queryString} id={id}/>
            <Suspense key={id} fallback={<FormSkeleton nFields={5} custonStyle={{with: '100% !important'}}/>}>
               <p>Edit invoice products</p>
            </Suspense>
        </>
    )
}
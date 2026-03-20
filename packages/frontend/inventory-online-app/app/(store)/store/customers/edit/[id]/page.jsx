import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import { buildQueryParams } from '@/app/utils/buildQueryParams'
import Route from '@/app/ui/routesLinks/routes'
import EditDetails from '@/app/(store)/store/customers/_components/edit/details'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import { Suspense } from 'react'


export default async function EditCustomer({ params, searchParams }) {
    const { id } = await params
    const urlParams = await searchParams
    
    const queryString = buildQueryParams(urlParams, ['page', 'data'])

    return (
        <>
            <Route path='customers' endpoints={['default', 'edit']} queryString={queryString}/> 
            
            <Suspense key={id} fallback={<FormSkeleton nFields={3}/>}>
                <EditDetails id={id}/>
            </Suspense>
        
        </>
    )
}
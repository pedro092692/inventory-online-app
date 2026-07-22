import Route from '@/app/ui/routesLinks/routes'
import CurrencyInfo from '@/app/(store)/store/currency/_components/edit/detail'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import { Suspense } from 'react'


export default async function EditCustomer({ params }) {
    const { id } = await params
    

    return (
        <>
            <Route path='currency' endpoints={['default', 'edit']} /> 
            
            <Suspense key={id} fallback={<FormSkeleton nFields={3}/>}>
                <CurrencyInfo id={id}/>
            </Suspense>
        
        </>
    )
}
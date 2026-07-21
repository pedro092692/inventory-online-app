import Route from '@/app/ui/routesLinks/routes'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import { Suspense } from 'react'


export default async function EditCustomer({ params }) {
    const { id } = await params
  
    return (
        <>
            <Route path='staff' endpoints={['default', 'edit']}/> 
            
            <Suspense key={id} fallback={<FormSkeleton nFields={7}/>}>
                
            </Suspense>
        
        </>
    )
}
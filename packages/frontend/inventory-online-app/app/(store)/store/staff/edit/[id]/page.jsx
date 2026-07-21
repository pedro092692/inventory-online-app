import Route from '@/app/ui/routesLinks/routes'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import StaffInfo from '@/app/(store)/store/staff/_components/edit/staffDetail'
import { Suspense } from 'react'


export default async function EditCustomer({ params }) {
    const { id } = await params
  
    return (
        <>
            <Route path='staff' endpoints={['default', 'edit']}/> 
            
            <Suspense key={id} fallback={<FormSkeleton nFields={7}/>}>
                <StaffInfo id={id} />
            </Suspense>
        
        </>
    )
}
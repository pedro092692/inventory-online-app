import Route from '@/app/ui/routesLinks/routes'
import AddStaffForm from '@/app/(store)/store/staff/_components/add/addStaffForm'

export default function AddStaff() {
    return (
        <>
            <Route path='staff' endpoints={['default', 'add']} /> 
            <AddStaffForm />
        </>
    )
}
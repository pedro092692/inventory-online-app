import AddAdminForm from '@/app/(admin)/admin/admins/_components/add/addAdminForm'
import { getCurrentUser } from '@/app/utils/getCurrentUser'

export default async function AddAdminPage() {
    const userInfo = await getCurrentUser()

    if (userInfo?.is_super_admin !== true) {
        return <p className='p2-r errorMsg'>Solo el super administrador puede agregar nuevos administradores.</p>
    }

    return (
        <>
            <h1 className='h3'>Agregar un nuevo administrador</h1>
            <AddAdminForm/>
        </>
    )
}

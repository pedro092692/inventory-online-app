import GetItemAction from '@/app/lib/actions/get'
import List from '@/app/ui/list/list'

export default async function Admins() {
    const response = await GetItemAction('users/admins')
    const { data, error } = response

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    const admins = data?.admins || []

    const tableData = admins.map((admin) => ({
        id: admin.id,
        email: admin.email,
        rol: admin.is_super_admin ? 'Super administrador' : 'Administrador'
    }))

    if (tableData.length === 0) {
        return <p className='p2-r'>Aún no hay administradores registrados.</p>
    }

    return (
        <List
            tableHead={{
                email: 'Correo',
                rol: 'Rol'
            }}
            tableData={tableData}
            showActions={false}
        />
    )
}

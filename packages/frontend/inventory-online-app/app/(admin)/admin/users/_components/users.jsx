import GetItemAction from '@/app/lib/actions/get'
import List from '@/app/ui/list/list'
import styles from '@/app/(store)/store/customers/_components/customers.module.css'

export default async function Users({ limit = 10, page = 1, query = null }){
 
    const enpoint = query ? 'users/search-owner' : 'users/store-owners-all'
    const params = new URLSearchParams()
    const rawParams = params.toString()
    
    if (query){
        params.append('query', query)
        params.append('limitResults', limit)
        params.append('page', page)
    }else{
        params.append('limit', limit)
        params.append('page', page)
    }

    const url = `${enpoint}?${params.toString()}`



    const response = await GetItemAction(url)
    
    const {data, error} = response
    const rawData = data?.users || data?.storeOwners || []
    
    const transformData = (users) => {
        let data = []
        if (users.length > 0) {
            data = users.map(user => (
                {
                    email: user.email,
                    tenant_id: user.tenant_id,
                    deteletedAt: user.deletedAt ? user.deletedAt : 'Activo',
                    rol: user?.role?.name ? 'Dueño de tienda' : 'Error' || 'null',
                    id: user.id,
                }
            ))
        }
        return data
    }
    
    const users = transformData(rawData)

    if (error) {
        return (
            <div>
                <p className='p2-r errorMsg'>{error}</p>
            </div>
        )
    }
    
    return (
        <List
            tableHead={
                {
                    'email': 'Correo',
                    'tenant_id': 'Identificador',
                    'isActive': 'Usuario Eliminado',
                    'role': 'Rol',
                    'actions': 'Acciones'
                }
            }
            tableData={users}
            showActions={true}
            showDelete={false}
            params={rawParams}
            endpoint='users'
            deleteKey={'userId'}
            userPermissions={['view', 'update', 'delete']}
            deleteMsg='Usuario Eliminado.'
            customClass={styles.table}
            typeList={'admin'}
        />
    )    
} 
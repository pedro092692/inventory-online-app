import GetItemAction from '@/app/lib/actions/get'
import List from '@/app/ui/list/list'
import styles from '@/app/(store)/store/customers/_components/customers.module.css'

export default async function Sellers({}) {
    const endpoint = 'sellers/all'
    const response = await GetItemAction(endpoint)
    const {data, error} = response 
    const rawSellers = data?.sellers || []
    
    const sellers = rawSellers.map(seller => {
        return {
            name: seller.name,
            last_name: seller.last_name,
            id_number: new Intl.NumberFormat('es-Ve').format(seller.id_number),
            rol: seller.is_supervisor ? 'Supervisor' : 'Cajero',
            address: seller.address,
            id: seller.id,
        }
    })

    const userPermissions = data?.permissions || []
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
                    'name': 'Nombre',
                    'last_name': 'Apellido',
                    'id_number': 'Cedula',
                    'rol': 'Cargo',
                    'address': 'Dirección',
                    'actions': 'Acciones'
                }
            }
            showActions={true}
            tableData={sellers}
            endpoint='staff'
            deleteKey={'sellerId'}
            userPermissions={userPermissions}
            deleteMsg='Personal eliminado con éxito'
            customClass={styles.table}
            CustomStyles={{height: 'auto'}}
        />
    ) 
}
import GetItemAction from '@/app/lib/actions/get'
import List from '@/app/ui/list/list'
import styles from '@/app/(store)/store/customers/_components/customers.module.css'
import { Container } from '@/app/ui/utils/container'
import DeletedSellers from '@/app/(store)/store/staff/_components/deleted/deleted'
import { Button } from '@/app/ui/utils/button/buttons'
import Link from 'next/link'

export default async function Sellers({}) {
    const endpoint = 'sellers/all'
    const deletedUrl = 'sellers/all?onlyDelete=true'
    const [response, deleted] = await Promise.all([GetItemAction(endpoint), GetItemAction(deletedUrl)])
    const {data, error} = response 
    const {data: deletedData, error: detetedError} = deleted
    const rawSellers = data?.sellers || []
    const rawDeleted = deletedData.sellers || []
    
    const formatedSeller = (sellers) => {
        return sellers.map(seller => {
            return {
                name: seller.name,
                last_name: seller.last_name,
                id_number: new Intl.NumberFormat('es-Ve').format(seller.id_number),
                rol: seller.is_supervisor ? 'Supervisor' : 'Cajero',
                address: seller.address,
                id: seller.id,
            }
        })
    }
    const sellers = formatedSeller(rawSellers)
    const deletedSellers = formatedSeller(rawDeleted)

    

    const userPermissions = data?.permissions || []
    if (error) {
        return (
            <div>
                <p className='p2-r errorMsg'>{error}</p>
            </div>
        )
    }

    return (
        <Container
            padding={'0px'}
            width={'100%'}
            direction={'column'}
            gap={'32px'}
        >
            {
                sellers.length > 0 
                ?
                <>
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
                
                    {rawDeleted.length > 0 && <DeletedSellers sellers={deletedSellers} userPermissions={userPermissions}/>}
                    
                </>
                :
                <Container
                    direction={'column'}
                    gap={'4px'}
                >
                    <p className='p1-b'>No tienes a ningún vendedor para tu negocio solo estás tú. 😅</p>
                    <p className='p1-b'>Puedes agregar hasta 5 vendedores si lo necesitas, o seguir vendiendo todo tú 😎.</p>
                    <Link href={'/store/staff/add'}>
                        <Button showIcon={true} type={'secondary'} icon='circlePlus' children='Agregar Personal'
                        className='p3-r shadow'/>
                    </Link>
                </Container>
                
                
            }
            
        </Container>
    ) 
}
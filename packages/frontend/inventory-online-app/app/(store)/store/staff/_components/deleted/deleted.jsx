'use client'
import List from '@/app/ui/list/list'
import styles from '@/app/(store)/store/customers/_components/customers.module.css'
import { Container } from '@/app/ui/utils/container'

export default function DeletedSellers({sellers = [], userPermissions = []}) {
    
    return (
        <Container
            padding={'0px'}
            width={'100%'}
            direction={'column'}
            gap={'16px'}
            alignItem={'start'}
        >
            <p className='p1-b'>Registros eliminados:</p>
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
                showDelete={false}
                showEdit={true}
                showView={false}
                tableData={sellers}
                endpoint='staff'
                deleteKey={'sellerId'}
                userPermissions={userPermissions}
                deleteMsg='Personal eliminado con éxito'
                customClass={styles.table}
                CustomStyles={{height: 'auto'}}
                />
        </Container>
    )
}

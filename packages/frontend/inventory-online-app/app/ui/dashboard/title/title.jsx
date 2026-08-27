import { Container } from '@/app/ui/utils/container'
import { IconSection } from '@/app/ui/utils/iconSection/iconSection'
import styles from './title.module.css'
import { getCurrentUser } from '@/app/utils/getCurrentUser'
import { Button } from '@/app/ui/utils/button/buttons'

export async function Title({ title, icon, showUserInfo = true}) {
    const userInfo = await getCurrentUser()

    // Los usuarios de una tienda (dueño, supervisor, cajero) ven el nombre de
    // la tienda en vez de su email; viaja embebido en el JWT (se agrega al
    // hacer login), así que no hace falta pedirlo de nuevo en cada página.
    const displayName = (userInfo?.role !== 1 && userInfo?.store_name) || userInfo?.email

    return (
        <Container
            className={`shadow ${styles.titleContainer}`}
        >
            <Container
                padding='0'
            >
                <IconSection icon={icon} />
                <h1 className='h3'>{title}</h1>
            </Container>
            { showUserInfo && userInfo && <Button 
                className='p2-r shadow-sm'
                style={{cursor: 'auto', textTransform: 'capitalize'}}
                showIcon={true}
                icon={'store'}
                type={'grey'}  
                children={displayName}/>
            }
            
        </Container>
    )
}
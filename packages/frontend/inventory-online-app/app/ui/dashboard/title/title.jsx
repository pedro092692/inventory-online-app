import { Container } from '@/app/ui/utils/container'
import { IconSection } from '@/app/ui/utils/iconSection/iconSection'
import styles from './title.module.css'
import { getCurrentUser } from '@/app/utils/getCurrentUser'

export async function Title({ title, icon, showUserInfo = true}) {
    const userInfo = await getCurrentUser()
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
            { showUserInfo && userInfo &&<p className='p2-r'>{userInfo.email}</p> }
        </Container>
    )
}
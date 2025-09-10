import { Container } from '@/app/ui/utils/container'
import { IconSection } from '@/app/ui/utils/iconSection/iconSection'
import styles from './title.module.css'

export function Title({ title, icon }) {
    return (
        <Container
            className={`shadow ${styles.titleContainer}`}
        >   
            <IconSection icon={icon} />
            <h1 className='h3'>{title}</h1>
        </Container>
    )
}
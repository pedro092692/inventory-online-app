import { Container } from '@/app/ui/utils/container'
import { Logo } from '@/app/ui/utils/logo'
import { Icon } from '../icons/icons'
import styles from './iconSection.module.css'

export function IconSection({ icon }) {
    return (
        <Container
            className={`shadow ${styles.iconContainer}`}
        >
            {icon ? <Icon icon={icon} size={[24, 24]}  /> : <Logo type='iconMono' style={{with: '24px', height: '24px'}}/>}
        </Container>
    )
}
import { Container } from '@/app/ui/utils/container'
import styles from './alert.module.css'

export function Alert({showContainer=false}) {
    console.log('show alert..', showContainer)
    console.log(styles.active)
    return (
        <div className={`${styles.container} ${showContainer? styles.active : ''}`}>
            <Container className={`${styles.alert} shadow`}>
                <h1>Delete alert..</h1>
            </Container>
        </div>
    )
}
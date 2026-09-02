import { Container } from '@/app/ui/utils/container'
import { Panel } from '@/app/ui/dashboard/panel/panel'
import styles from '@/app/(store)/layout.module.css'

export default function Dashboard({children}) {
    return (
        <Container
            className={styles.wrapper}
            flexGrow='1'
            alignItem='start'
            justifyContent='start'
            direction='row'
            padding='0'
            gap='0px'


        >
            {/* panel */}
            <Panel type={'admin'}/>
            {/* panel */}
            <Container
                padding='8px'
                direction='column'
                flexGrow='1'
                alignItem='start'
                justifyContent='start'
                gap='8px'
            >
                {/* content */}
                {children}
            </Container>
        </Container>
    )
}
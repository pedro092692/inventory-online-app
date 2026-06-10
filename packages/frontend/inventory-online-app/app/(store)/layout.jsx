import { Container } from '@/app/ui/utils/container'
import { Panel } from '../ui/dashboard/panel/panel'
export default function Dashboard({children, }) {
    return (
        <Container
            marginLeft={'15%'}
            flexGrow='1'
            alignItem='start'
            justifyContent='start'
            direction='row'
            padding='0'
            gap='0px'

        >
            {/* panel */}
            <Panel />
            {/* panel */}
            <Container
                padding='8px'
                direction='column'
                flexGrow='1'
                height='100%'
                alignItem='start'
                justifyContent='start'
            >
                {/* content */}
                {children}
            </Container>
        </Container>
    )
}
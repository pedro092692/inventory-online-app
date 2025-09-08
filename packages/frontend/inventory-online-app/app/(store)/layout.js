import { Container } from '@/app/ui/utils/container'
import { Panel } from '../ui/dashboard/panel/panel'
export default function Dashboard({ children}) {
    return (
        <Container
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
                padding='24px'
                direction='column'
                flexGrow='1'
                height='100%'
                alignItem='start'
                justifyContent='start'
            >
                {children}
            </Container>
        </Container>
    )
}
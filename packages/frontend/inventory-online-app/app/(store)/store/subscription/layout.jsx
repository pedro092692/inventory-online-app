import { Title } from '@/app/ui/dashboard/title/title'
import { Container } from '@/app/ui/utils/container'

export default function SubscriptionLayout({children}) {
    return (
        <>
            <Title title="Mi Tienda" icon='store'/>
            <Container
                padding='24px'
                flexGrow='1'
                width='100%'
                alignItem='start'
                justifyContent='start'
                direction='column'
            >
                {children}
            </Container>
        </>
    )
}

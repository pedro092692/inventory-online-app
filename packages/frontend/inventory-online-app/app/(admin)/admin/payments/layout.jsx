import { Title } from '@/app/ui/dashboard/title/title'
import { Container } from '@/app/ui/utils/container'

export default function PaymentsLayout({children}) {
    return (
        <>
            <Title title="Pagos pendientes" icon="cash"/>
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

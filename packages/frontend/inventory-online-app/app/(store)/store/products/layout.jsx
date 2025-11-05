import { Title } from '@/app/ui/dashboard/title/title'
import { Container } from '@/app/ui/utils/container'

export default function ProductLayout({children}) {
    return (
        <>
            <Title title="Productos" icon={'product'}/>
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
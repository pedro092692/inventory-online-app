
import { Title } from "@/app/ui/dashboard/title/title"
import { Container } from "@/app/ui/utils/container"

export default function BillsLayout({children}) {
    return (
        <>
            <Title title="Ordenes de compra" icon='paper'/>
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
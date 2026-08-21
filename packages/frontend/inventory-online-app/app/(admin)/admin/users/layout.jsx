import { Title } from "@/app/ui/dashboard/title/title"
import { Container } from "@/app/ui/utils/container"

export default function UsersLayout({children}) {
    return (
        <>
            <Title title="Usuarios" icon={'users'}/>
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
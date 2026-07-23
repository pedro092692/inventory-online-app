import { Title } from '@/app/ui/dashboard/title/title'
import { Container } from '@/app/ui/utils/container'
import NavReports from '@/app/(store)/store/reports/_components/navBar/navBar'

export default function ProductLayout({children}) {
    return (
        <>
            <Title title="Reportes" icon='report'/>
            <Container
                padding='8px 0px'
                flexGrow='1'
                width='100%'
                alignItem='start'
                justifyContent='start'
                direction='column'
            >
                <NavReports />
                {children}
            </Container>
        </>
    )
}
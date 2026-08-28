import { Title } from '@/app/ui/dashboard/title/title'
import { Container } from '@/app/ui/utils/container'
import NavReports from '@/app/(store)/store/reports/_components/navBar/navBar'
import { getCurrentUser } from '@/app/utils/getCurrentUser'

export default async function ProductLayout({children}) {
    const currentUser = await getCurrentUser()
    // Only supervisors/store owners see the audit trail — a plain cashier account
    // ('user') shouldn't be able to browse who overrode a payment or a return.
    const canViewAudit = currentUser?.role_name && currentUser.role_name !== 'user'

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
                <NavReports canViewAudit={canViewAudit}/>
                {children}
            </Container>
        </>
    )
}
import { Container } from '@/app/ui/utils/container'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import PendingPayments from '@/app/(admin)/admin/payments/_components/pendingPayments'
import PaymentsStatusTabs from '@/app/(admin)/admin/payments/_components/paymentsStatusTabs'

const VALID_STATUSES = ['pending', 'approved', 'rejected', 'all']

export default async function Payments({searchParams}) {
    const params = await searchParams
    const currentPage = Number(params?.page) || 1
    const currentStatus = VALID_STATUSES.includes(params?.status) ? params.status : 'pending'

    return (
        <Container
            direction='column'
            alignItem='start'
            padding='0px'
            width='100%'
        >
            <PaymentsStatusTabs/>
            <Suspense key={`${currentStatus}-${currentPage}`} fallback={<ListSkeleton nTitle={4}/>}>
                <PendingPayments page={currentPage} status={currentStatus}/>
            </Suspense>
        </Container>
    )
}

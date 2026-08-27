import { Container } from '@/app/ui/utils/container'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import PendingPayments from '@/app/(admin)/admin/payments/_components/pendingPayments'

export default async function Payments({searchParams}) {
    const params = await searchParams
    const currentPage = Number(params?.page) || 1

    return (
        <Container
            direction='column'
            alignItem='start'
            padding='0px'
            width='100%'
        >
            <Suspense key={currentPage} fallback={<ListSkeleton nTitle={4}/>}>
                <PendingPayments page={currentPage}/>
            </Suspense>
        </Container>
    )
}

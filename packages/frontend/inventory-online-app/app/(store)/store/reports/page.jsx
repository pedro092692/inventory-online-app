import TopSpenders from '@/app/(store)/store/reports/_components/customers/topSpenderData'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'

export default async function Reports() {
    return (
        <>
            <Suspense fallback={<ListSkeleton nTitle={2} />}>
                <TopSpenders />
            </Suspense>

        </>
    )
}
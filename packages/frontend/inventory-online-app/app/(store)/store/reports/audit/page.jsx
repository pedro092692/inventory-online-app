import { Container } from '@/app/ui/utils/container'
import Pagination from '@/app/ui/pagination/pagination'
import GetItemAction from '@/app/lib/actions/get'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import AuditLogs from '@/app/(store)/store/reports/_components/audit/auditLogsData'

export default async function AuditReport({searchParams}) {
    const params = await searchParams
    const currentPage = Number(params?.page) || 1

    const response = await GetItemAction('audit-logs/total-pages', 'Hubo un error inesperado intenta nuevamente')
    const { data, error } = response || {}
    // A blocked (non-supervisor) user gets a 403 here, which the fetch layer surfaces
    // as `data.errors` rather than `error` — see auditLogsData.jsx for the same check.
    const forbidden = data?.errors
    const totalPages = data?.total || 1

    return (
        <Container
            direction={'column'}
            padding={'16px 0 0 0'}
            alignItem={'start'}
            width={'100%'}
            gap={'16px'}
        >
            <Suspense key={currentPage} fallback={<ListSkeleton nTitle={5} />}>
                <Container
                    padding={'16px'}
                    width={'100%'}
                    gap={'24px'}
                >
                    
                    <AuditLogs page={currentPage} />
                </Container>
            </Suspense>
            {
                (error || forbidden) ?
                (
                    <p className='p2-r errorMsg'>{error || forbidden}</p>
                )
                :
                (
                    data?.total > 0 &&
                    <Pagination totalPages={totalPages} />
                )
            }
        </Container>
    )
}

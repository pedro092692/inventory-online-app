import { Title } from '@/app/ui/dashboard/title/title'
import { Suspense } from 'react'
import DashboardStats from './_components/dashboardStats'
import DashboardShortcuts from './_components/dashboardShortcuts'
import { Container } from '@/app/ui/utils/container'

function KpiRowSkeleton({ count = 6 }) {
    return (
        <Container padding={'0px'} width={'100%'} justifyContent={'flex-start'} gap={'20px'}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 h-19 w-55 animate-pulse" />
            ))}
        </Container>
    )
}

export default function AdminDashboard() {
    return (
        <Container direction={'column'} alignItem={'start'} padding='0px' width='100%' gap={'0px'}>
            <Title title='Panel Administrador' />
            <Container direction={'column'} alignItem={'start'} padding='24px' width='100%' gap={'16px'}>
                <h2 className='h3'>Vista Rápida</h2>
                <Suspense fallback={<KpiRowSkeleton />}>
                    <DashboardStats />
                </Suspense>
                <h2 className='h3'>Accesos Rápido</h2>
                <DashboardShortcuts />
            </Container>
        </Container>
    )
}

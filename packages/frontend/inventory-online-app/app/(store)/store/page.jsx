import { Title } from '@/app/ui/dashboard/title/title'
import { Suspense } from 'react'
import DashboardKpis from './_components/dashboardKpis'
import DashboardShortcuts from './_components/dashboardShortcuts'
import LowStockWidget from './_components/lowStockWidget'
import { Container } from '@/app/ui/utils/container'

function KpiRowSkeleton({ count = 4 }) {
    return (
        <Container padding={'0px'} width={'100%'} justifyContent={'flex-start'} gap={'20px'}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 h-19 w-55 animate-pulse" />
            ))}
        </Container>
    )
}

function WidgetSkeleton() {
    return <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 h-40 w-full animate-pulse" />
}

export default function HomeStore() {
    return (
        <Container 
            direction={'column'} 
            alignItem={'start'}
            padding='0px' 
            width='100%' 
            gap={'0px'}>
            <Title title='Dashboard' />
            <Container
                direction={'column'}
                padding={'24px'}
                width={'100%'}
                alignItem={'start'}
                gap={'16px'}
            >
                <h2 className='h3'>Vista Rápida</h2>
                <Suspense fallback={<KpiRowSkeleton />}>
                    <DashboardKpis />
                </Suspense>

                <h2 className='h3'>Acceso Rápido</h2>
                <DashboardShortcuts />

                <h2 className='h3'>Productos Vista Rápida</h2>
                <Suspense fallback={<WidgetSkeleton />}>
                    <LowStockWidget  />
                </Suspense>
            </Container>
        </Container>
    )
}
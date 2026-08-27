import GetItemAction from '@/app/lib/actions/get'
import KpiCard from '@/app/(store)/store/reports/_components/kpiCards/kpiCards'
import { Container } from '@/app/ui/utils/container'
import Link from 'next/link'
import { DollarSign, Store, CheckCircle2, XCircle, Inbox, TrendingUp } from 'lucide-react'

/**
 * Top KPI row for the platform admin's home dashboard (/admin): the platform's own
 * billing exchange rate, store counts (total/active/inactive — "active" mirrors
 * StoreStatusService: not blocked AND subscription not expired), pending receipts
 * awaiting review, and an estimate of this month's billing (see
 * UserService.getDashboardStats for why it's approved-payments-count × fixed USD price
 * rather than a sum of Bs amounts).
 */
export default async function DashboardStats() {
    const [rateRes, statsRes] = await Promise.all([
        GetItemAction('exchange-rate/latest', 'Hubo un error inesperado intenta nuevamente'),
        GetItemAction('users/dashboard-stats', 'Hubo un error inesperado intenta nuevamente'),
    ])

    const rate = rateRes?.data?.rate?.value
    const stats = statsRes?.data?.stats || {}

    return (
        <Container padding={'0px'} width={'100%'} justifyContent={'flex-start'} gap={'20px'}>
            <KpiCard label={'Tasa del dólar (plataforma)'} value={rate ? `Bs. ${rate}` : '—'} icon={DollarSign} />
            <KpiCard label={'Tiendas totales'} value={stats.totalStores ?? '—'} icon={Store} />
            <KpiCard label={'Tiendas activas'} value={stats.activeStores ?? '—'} icon={CheckCircle2} textColor='green-700' />
            <KpiCard label={'Tiendas inactivas'} value={stats.inactiveStores ?? '—'} icon={XCircle}
                textColor={stats.inactiveStores > 0 ? 'red-700' : 'default'} />
            <Link href="/admin/payments?status=pending">
                <KpiCard label={'Recibos pendientes'} value={stats.pendingPayments ?? '—'} icon={Inbox}
                    textColor={stats.pendingPayments > 0 ? 'red-700' : 'default'} />
            </Link>
            <KpiCard label={'Facturación este mes'} value={`$${stats.billedThisMonthUsd ?? 0}`} icon={TrendingUp} textColor='green-700' />
        </Container>
    )
}

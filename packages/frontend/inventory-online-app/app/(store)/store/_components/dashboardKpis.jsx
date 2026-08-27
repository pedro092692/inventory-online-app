import GetItemAction from '@/app/lib/actions/get'
import KpiCard from '@/app/(store)/store/reports/_components/kpiCards/kpiCards'
import { Container } from '@/app/ui/utils/container'
import { DollarSign, Users, Package, CalendarClock } from 'lucide-react'

/**
 * Top KPI row for the store's home dashboard (/store). Intentionally shows counts only
 * (dollar rate, clients, registered products, subscription) — no cost/margin figures —
 * so it's safe for every store role (owner, manager, cashier) to see, not just the owner.
 * See reports/_components/products/kpi.jsx for the version WITH inventory value, used
 * inside /store/reports which is a more restricted area.
 */
export default async function DashboardKpis() {
    const [dollarRes, storeRes, customersRes, productsRes] = await Promise.all([
        GetItemAction('dollar-value/latest', 'Hubo un error inesperado intenta nuevamente'),
        GetItemAction('store/me', 'Hubo un error inesperado intenta nuevamente'),
        GetItemAction('reports/customers-kpi', 'Hubo un error inesperado intenta nuevamente'),
        GetItemAction('reports/products-kpi', 'Hubo un error inesperado intenta nuevamente'),
    ])

    const dollarRate = dollarRes?.data?.lastValue?.value
    const store = storeRes?.data?.store
    const customersKpi = customersRes?.data?.kpi || {}
    const productsKpi = productsRes?.data?.kpi || {}

    const daysUntil = (dateStr) => {
        if (!dateStr) return null
        const diffMs = new Date(dateStr).getTime() - Date.now()
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    }

    const remaining = daysUntil(store?.subscription_expires_at)
    const isBlocked = store?.is_active === false
    const isExpired = remaining !== null && remaining < 0

    const subscriptionLabel = isBlocked
        ? 'Bloqueada'
        : remaining === null
            ? 'Sin información'
            : remaining >= 0
                ? `Vence en ${remaining} día${remaining === 1 ? '' : 's'}`
                : `Vencida hace ${Math.abs(remaining)} día${Math.abs(remaining) === 1 ? '' : 's'}`

    return (
        <Container padding={'0px'} width={'100%'} justifyContent={'flex-start'} gap={'20px'}>
            <KpiCard label={'Tasa del dólar'} value={dollarRate ? `Bs. ${dollarRate}` : '—'} icon={DollarSign} mainTextSize='md'/>
            <KpiCard label={'Clientes'} value={customersKpi.total_customers ?? '—'} icon={Users} mainTextSize='md'/>
            <KpiCard label={'Productos registrados'} value={productsKpi.total_products ?? '—'} icon={Package} mainTextSize='md'/>
            <KpiCard label={'Suscripción'} value={subscriptionLabel} icon={CalendarClock}
                textColor={isBlocked || isExpired ? 'red-700' : 'green-700'} mainTextSize='md'/>
        </Container>
    )
}

import Request from '@/app/utils/request'
import KpiCard from '@/app/(store)/store/reports/_components/kpiCards/kpiCards'
import { Users, UserCog, Receipt, Info, LockKeyhole, CalendarClock, DollarSign} from 'lucide-react'
import {Container} from '@/app/ui/utils/container'

export default async function StoreOverview() {
    const response = await Request('store/me', 'GET', null, 'Hubo un error inesperado intenta nuevamente')
    const { data, error } = response

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    const { store, stats, amountDueUsd, amountDueBs, exchangeRate } = data || {}

    const daysUntil = (dateStr) => {
        if (!dateStr) return null
        const diffMs = new Date(dateStr).getTime() - Date.now()
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    }

    const remaining = daysUntil(store?.subscription_expires_at)

    const subscriptionLabel = remaining === null
        ? 'Sin información de pago'
        : remaining >= 0
            ? `Activa, vence en ${remaining} día${remaining === 1 ? '' : 's'}`
            : `Vencida hace ${Math.abs(remaining)} día${Math.abs(remaining) === 1 ? '' : 's'}`

    const subscription_expires_at = new Date(store?.subscription_expires_at)
        .toLocaleDateString('es-Es', { day: '2-digit', month: '2-digit', year: '2-digit'})

    const isBlocked = store?.is_active === false

    return (
        <Container
            padding={'0px 0px'}
            width={'100%'}
            // justifyContent={'space-between'}
            justifyContent={'flex-start'}
            gap={'32px'}
        >
            <KpiCard label={'Suscripción'} value={isBlocked ? 'Bloqueada' : subscriptionLabel} 
                icon={CalendarClock} text='md'
                textColor={ isBlocked ? 'red-700' : 'green-700'}
                mainTextSize='md' 
                extraText={`${subscription_expires_at}`}
            />
            {
                !isBlocked && 
                <KpiCard label={'Monto a pagar:'} 
                    value={`$${amountDueUsd}${exchangeRate ? ` (Bs. ${amountDueBs})` : ''}`}
                    icon={DollarSign} text='md'
                    extraText={exchangeRate ? `Tasa usada: Bs. ${exchangeRate} por USD` : false}
                textColor={ isBlocked ? 'red-700' : 'green-700'} mainTextSize='md'/>
            }

            <KpiCard label={'Estado de la cuenta:'} value={isBlocked ? 'Bloqueada' : 'Activa'} icon={Info} text='md'
                textColor={ isBlocked ? 'red-700' : 'green-700'} mainTextSize='md'/>
            {
                isBlocked && store?.blocked_reason && 
                <KpiCard label={'Motivo del bloqueo'} value={store.blocked_reason} icon={LockKeyhole} text='md' mainTextSize='md'/>
            }
            
            <KpiCard label={'Total Vendedores'} value={stats?.sellerCount ?? '—'} icon={UserCog} text='md' mainTextSize='md'/>
            <KpiCard label={'Total Clientes'} value={stats?.sellerCount ?? '—'} icon={Users} text='md' mainTextSize='md'/>
            <KpiCard label={'Última factura'} 
                value={stats?.lastInvoiceDate ? new Date(stats.lastInvoiceDate).toLocaleDateString('es-VE') : 'Sin facturas'} 
                icon={Receipt} text='md' mainTextSize='md'/>
        </Container>
    )
}

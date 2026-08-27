import Request from '@/app/utils/request'
import styles from '@/app/(store)/store/subscription/_components/subscription.module.css'

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
            ? `Activa — vence en ${remaining} día${remaining === 1 ? '' : 's'}`
            : `Vencida hace ${Math.abs(remaining)} día${Math.abs(remaining) === 1 ? '' : 's'}`

    const subscriptionColor = remaining === null ? '#888' : remaining >= 0 ? 'green' : '#c0392b'

    const isBlocked = store?.is_active === false

    return (
        <div className={`${styles.card} shadow`}>
            <fieldset className={styles.fieldset}>
                <legend className={`p2-b ${styles.legend}`}>Salud de la tienda</legend>
                <p className='p2-r'>Vendedores: {stats?.sellerCount ?? '—'}</p>
                <p className='p2-r'>Clientes: {stats?.customerCount ?? '—'}</p>
                <p className='p2-r'>
                    Última factura: {stats?.lastInvoiceDate ? new Date(stats.lastInvoiceDate).toLocaleDateString('es-VE') : 'Sin facturas'}
                </p>
                <p className='p2-r' style={{color: isBlocked ? '#c0392b' : 'green'}}>
                    Estado de la cuenta: {isBlocked ? 'Bloqueada' : 'Activa'}
                </p>
                {isBlocked && store?.blocked_reason &&
                    <p className='p2-r' style={{color: '#c0392b'}}>
                        Motivo del bloqueo: {store.blocked_reason}
                    </p>
                }
            </fieldset>

            <fieldset className={styles.fieldset}>
                <legend className={`p2-b ${styles.legend}`}>Suscripción</legend>
                <p className='p2-r' style={{color: subscriptionColor}}>{subscriptionLabel}</p>
                <p className='p2-r'>
                    Monto a pagar: ${amountDueUsd}{exchangeRate ? ` (Bs. ${amountDueBs})` : ''}
                </p>
                {exchangeRate && <p className='p3-r' style={{color: '#888'}}>Tasa usada: Bs. {exchangeRate} por USD</p>}
            </fieldset>
        </div>
    )
}

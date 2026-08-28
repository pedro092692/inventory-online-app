import GetItemAction from '@/app/lib/actions/get'
import List from '@/app/ui/list/list'

const ACTION_LABELS = {
    CANCEL_PAYMENT: 'Pago cancelado',
    FULL_REFUND: 'Devolución total',
    PARTIAL_REFUND: 'Devolución parcial',
}

export default async function AuditLogs({limit = 10, page = 1}) {
    const params = new URLSearchParams()
    params.append('limit', limit)
    params.append('page', page)
    const url = `audit-logs/all?${params.toString()}`

    const response = await GetItemAction(url, 'Hubo un error inesperado intenta nuevamente')
    const { data, error } = response
    // A blocked (non-supervisor) user gets a 403 here, which the fetch layer surfaces
    // as `data.errors` rather than `error`.
    const forbidden = data?.errors
    const rawData = data?.auditLogs || []

    const formatDetail = (log) => {
        if (log.action === 'CANCEL_PAYMENT') {
            const amount = log.old_value?.amount
            return amount ? `Monto anulado: $${amount}` : '—'
        }
        if (log.action === 'FULL_REFUND' || log.action === 'PARTIAL_REFUND') {
            const credit = log.new_value?.total_credit_generated
            return credit !== undefined ? `Crédito generado: $${credit}` : '—'
        }
        return '—'
    }

    const auditLogs = rawData.map((log) => ({
        date: log.created_at
            ? new Date(log.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
            : '—',
        action: ACTION_LABELS[log.action] || log.action,
        user: log.user?.email || 'Usuario desconocido',
        authorizedBy: log.supervisorSeller ? `${log.supervisorSeller.name} ${log.supervisorSeller.last_name}` : '—',
        detail: formatDetail(log),
    }))

    if (error || forbidden) {
        return <p className='p2-r errorMsg'>{error || forbidden}</p>
    }

    if (auditLogs.length === 0) {
        return <p className='p1-b'>Todavía no hay registros de auditoría.</p>
    }

    return (
        <List
            tableHead={{
                date: 'Fecha',
                action: 'Acción',
                user: 'Realizado por',
                authorizedBy: 'Autorizado por',
                detail: 'Detalle',
            }}
            tableData={auditLogs}
            showActions={false}
        />
    )
}

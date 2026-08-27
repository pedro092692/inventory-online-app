import Request from '@/app/utils/request'
import styles from '@/app/(store)/store/subscription/_components/subscription.module.css'

const statusLabels = {
    pending: 'En revisión',
    approved: 'Aprobado',
    rejected: 'Rechazado'
}

export default async function PaymentHistory() {
    const response = await Request('store/payments', 'GET', null, 'Hubo un error inesperado intenta nuevamente')
    const { data, error } = response

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    const payments = data?.payments || []

    return (
        <div className={`${styles.card} shadow`}>
            <fieldset className={styles.fieldset}>
                <legend className={`p2-b ${styles.legend}`}>Historial de pagos</legend>
                {payments.length === 0 && <p className='p2-r'>Aún no has enviado ningún comprobante.</p>}
                {payments.map((payment) => (
                    <div key={payment.id} className={styles.historyRow}>
                        <span className={`p2-r ${styles.statusBadge} ${styles[payment.status]}`}>
                            {statusLabels[payment.status] || payment.status}
                        </span>
                        <p className='p2-r'>Monto declarado: Bs. {payment.amount_declared}</p>
                        <p className='p3-r' style={{color: '#888'}}>
                            Enviado: {new Date(payment.submitted_at).toLocaleDateString('es-VE')}
                        </p>
                        {payment.status === 'rejected' && payment.rejection_reason &&
                            <p className='p3-r' style={{color: '#c0392b'}}>Motivo: {payment.rejection_reason}</p>
                        }
                    </div>
                ))}
            </fieldset>
        </div>
    )
}

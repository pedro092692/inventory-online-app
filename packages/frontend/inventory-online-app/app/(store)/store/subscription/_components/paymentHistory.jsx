import Request from '@/app/utils/request'
import List from '@/app/ui/list/list'
import Pagination from '@/app/ui/pagination/pagination'
import styles from '@/app/(store)/store/subscription/_components/subscription.module.css'

const statusLabels = {
    pending: 'En revisión',
    approved: 'Aprobado',
    rejected: 'Rechazado'
}

const LIMIT = 10

export default async function PaymentHistory({page = 1}) {
    const response = await Request(`store/payments?limit=${LIMIT}&page=${page}`, 'GET', null, 'Hubo un error inesperado intenta nuevamente')
    const { data, error } = response

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    const payments = data?.payments || []
    const totalPages = data?.totalPages || 1

    const tableData = payments.map((payment) => ({
        id: payment.id,
        amount: `Bs. ${payment.amount_declared}`,
        status: (
            <span className={`p3-r ${styles.statusBadge} ${styles[payment.status] || ''}`}>
                {statusLabels[payment.status] || payment.status}
            </span>
        ),
        submitted_at: new Date(payment.submitted_at).toLocaleDateString('es-VE'),
        rejection_reason: payment.status === 'rejected' && payment.rejection_reason ? payment.rejection_reason : '—'
    }))

    return (
        <div className={`${styles.card} shadow`}>
            <fieldset className={styles.fieldset}>
                <legend className={`p2-b ${styles.legend}`}>Historial de pagos</legend>

                {payments.length === 0 && <p className='p2-r'>Aún no has enviado ningún comprobante.</p>}

                {payments.length > 0 &&
                    <>
                        <List
                            tableHead={{
                                amount: 'Monto declarado',
                                status: 'Estado',
                                submitted_at: 'Enviado',
                                rejection_reason: 'Motivo de rechazo'
                            }}
                            tableData={tableData}
                            showActions={false}
                            CustomStyles={{height: 'auto'}}
                        />
                        {totalPages > 1 && <Pagination totalPages={totalPages}/>}
                    </>
                }
            </fieldset>
        </div>
    )
}

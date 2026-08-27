import Request from '@/app/utils/request'
import List from '@/app/ui/list/list'
import Pagination from '@/app/ui/pagination/pagination'
import PaymentActions from '@/app/(admin)/admin/payments/_components/paymentActions'
import styles from '@/app/(admin)/admin/payments/_components/payments.module.css'

const LIMIT = 10

const statusLabels = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado'
}

const emptyMessages = {
    pending: 'No hay pagos pendientes por revisar.',
    approved: 'No hay pagos aprobados todavía.',
    rejected: 'No hay pagos rechazados todavía.',
    all: 'No hay pagos registrados todavía.'
}

export default async function PendingPayments({page = 1, status = 'pending'}) {
    const statusParam = status && status !== 'all' ? `&status=${status}` : ''
    const response = await Request(`users/payments?limit=${LIMIT}&page=${page}${statusParam}`, 'GET', null, 'Hubo un error inesperado intenta nuevamente')
    const { data, error } = response

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    const payments = data?.payments || []
    const totalPages = data?.totalPages || 1

    if (payments.length === 0) {
        return <p className='p2-r'>{emptyMessages[status] || emptyMessages.all}</p>
    }

    const tableData = payments.map((payment) => ({
        store_name: payment.owner?.store?.name || 'Sin tienda',
        email: payment.owner?.email || '—',
        amount: `Bs. ${payment.amount_declared}`,
        status: <span className={`p3-r ${styles.statusBadge} ${styles[payment.status] || ''}`}>{statusLabels[payment.status] || payment.status}</span>,
        submitted_at: new Date(payment.submitted_at).toLocaleDateString('es-VE'),
        rejection_reason: payment.status === 'rejected' && payment.rejection_reason ? payment.rejection_reason : '—',
        id: payment.id,
    }))

    return (
        <>
            <List
                tableHead={{
                    store_name: 'Tienda',
                    email: 'Correo',
                    amount: 'Monto declarado',
                    status: 'Estado',
                    submitted_at: 'Enviado',
                    rejection_reason: 'Motivo de rechazo',
                    actions: 'Acciones'
                }}
                tableData={tableData}
                showActions={true}
                showView={false}
                showEdit={false}
                showDelete={false}
                customClass={styles.table}
                custonActionButton={(data) => <PaymentActions paymentId={data.id} status={status}/>}
            />
            {totalPages > 1 && <Pagination totalPages={totalPages}/>}
        </>
    )
}

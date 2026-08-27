import Request from '@/app/utils/request'
import List from '@/app/ui/list/list'
import Pagination from '@/app/ui/pagination/pagination'
import PaymentActions from '@/app/(admin)/admin/payments/_components/paymentActions'

const LIMIT = 10

export default async function PendingPayments({page = 1}) {
    const response = await Request(`users/payments/pending?limit=${LIMIT}&page=${page}`, 'GET', null, 'Hubo un error inesperado intenta nuevamente')
    const { data, error } = response

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    const payments = data?.payments || []
    const totalPages = data?.totalPages || 1

    if (payments.length === 0) {
        return <p className='p2-r'>No hay pagos pendientes por revisar.</p>
    }

    const tableData = payments.map((payment) => ({
        id: payment.id,
        store_name: payment.owner?.store?.name || 'Sin tienda',
        email: payment.owner?.email || '—',
        amount: `Bs. ${payment.amount_declared}`,
        submitted_at: new Date(payment.submitted_at).toLocaleDateString('es-VE')
    }))

    return (
        <>
            <List
                tableHead={{
                    store_name: 'Tienda',
                    email: 'Correo',
                    amount: 'Monto declarado',
                    submitted_at: 'Enviado',
                    actions: 'Acciones'
                }}
                tableData={tableData}
                showActions={true}
                showView={false}
                showEdit={false}
                showDelete={false}
                custonActionButton={(data) => <PaymentActions paymentId={data.id}/>}
            />
            {totalPages > 1 && <Pagination totalPages={totalPages}/>}
        </>
    )
}

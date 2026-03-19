import List from '@/app/ui/list/list'
import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'

export default function CustomerInvoices({ invoices, searchIsActive = false}) {
    const tableHead = {
        'bill_id': 'N° Recibo',
        'total': 'Total',
        'status': 'Estado',
        'date': 'Fecha',
        'actions': 'Acciones',
    }
    const transformData = (invoices) => {
        let data = []
        if (invoices.length > 0) {
            data = invoices.map(invoice => (
                {
                    bill_id: invoice.id,
                    total: `$ ${invoice.total}`,
                    status: invoice.status == 'paid' ? 'Pagado' : 'Pendiente',
                    date: new Date(invoice.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }), 
                    id: invoice.id
                }
            ))   
        }
        return data
    }

    const customerInvoices = transformData(invoices)
    return (
        <>
            {customerInvoices.length > 0 || searchIsActive ? 
                <List tableHead={tableHead} tableData={customerInvoices} showActions={false} />
                :
                <p>El cliente no tiene facturas</p>
            }
        </>
        
    )
}
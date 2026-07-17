import List from '@/app/ui/list/list'
import styles from '@/app/(store)/store/customers/detail/[id]/input.module.css'
import invoiceStyles from '@/app/(store)/store/bills/_components/invoices.module.css'

export default function CustomerInvoices({ invoices, searchIsActive = false, customer_id = null}) {
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
                <List 
                    tableHead={tableHead} 
                    tableData={customerInvoices} 
                    showActions={true} 
                    endpoint='bills'
                    queryString={`fromCustomer=true&customer_id=${customer_id}`}
                    CustomStyles={{height: '340px'}}
                    customClass={styles.table}
                    rowClassName={(rowData) => rowData.status === 'Pendiente' ? invoiceStyles.pendingRowCustomer : ''}
                />
                :
                <p>El cliente no tiene facturas</p>
            }
        </>
        
    )
}
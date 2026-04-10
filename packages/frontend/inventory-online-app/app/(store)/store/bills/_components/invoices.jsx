import GetItemAction from '@/app/lib/actions/get'
import List from '@/app/ui/list/list'
import styles from '@/app/(store)/store/bills/_components/invoices.module.css'

export default async function Invoices({limit = 10, page = 1, query = null, queryString = null}) {
    const endpoint = 'invoices/all'
    const params = new URLSearchParams()
    const rawParams = params.toString()

    params.append('limit', limit)
    params.append('page', page)

    const url  = `${endpoint}?${params.toString()}`

    const response = await GetItemAction(url)
    const {data, error} = response
    const rawData = data?.invoices || []
    const userPermissions = data?.permissions || []
    console.log(userPermissions)
    const transformData = (invoices) => {
        let data = []
        if (invoices.length > 0) {
            data = invoices.map(invoice => (
                {
                    invoice_number: invoice.id,
                    date: new Date(invoice.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
                    total: `$ ${invoice.total}`,
                    total_reference: new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(invoice.total_reference),
                    status: invoice.status == 'paid' ? 'Pagado' : 'Pendiente',
                    seller: invoice.seller.name,
                    customer: invoice.customer.name,
                    id: invoice.id,
                }
            ))
        }
        return data
    }

    const invoices = transformData(rawData)

    if (error) {
        return (
            <div>
                <p className='p2-r errorMsg'>{error}</p>
            </div>
        )
    }

    return (
        <List
            tableHead={
                {
                    'n_recibo': 'N° Recibo',
                    'fecha': 'Fecha',
                    'total': 'Total',
                    'total_bs': 'Total Bs',
                    'estado': 'Estado',
                    'vendedor': 'Vendedor',
                    'cliente': 'Cliente',
                    'actions': 'Acciones'
                }
            }
            showActions={true}
            showEdit={false}
            showDelete={false}
            tableData={invoices}
            params={rawParams}
            endpoint='invoices'
            deleteKey={'id'}
            userPermissions={userPermissions}
            queryString={queryString}
            deleteMsg='Recibo eliminado con éxito'
            customClass={styles.table}
        />
    )

}
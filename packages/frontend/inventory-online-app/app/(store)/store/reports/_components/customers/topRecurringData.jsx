import GetItemAction from '@/app/lib/actions/get'
import TopRecurringReport from './topRecurring'


export default async function TopRecurring() {
    // await new Promise (r => setTimeout(r, 1000))
    const endpoint = 'top-recurring-customers'
    const url = `reports/${endpoint}`
    const response = await GetItemAction(url, 'Hubo un error inesperado intenta nuevamente')
    const {data, error} = response
    const rawTopRecurring = data.map(({total_recurring, first_invoice, last_invoice, customer}) => {
        return {
            total_recurring,
            first_invoice,
            last_invoice,
            name: customer?.name || 'null',
            phone: customer?.phone || 'null'
        }
    })

    const topRecurring = rawTopRecurring.map((c) => {
        const first = new Date(c.first_invoice)
        const last = new Date(c.last_invoice)
        const days = Math.max(1, Math.round((last - first) / (1000 * 60 * 60 * 24)))
        return {
            name: c.name,
            value: parseInt(c.total_recurring, 10),
            phone: c.phone,
            daysAsCustomer: days,
            last_invoice: last.toLocaleDateString('es-VE')
        }
    })

    return (
        <TopRecurringReport  topRecurring={topRecurring} />
    )   
}
import CustomerInvoices from '@/app/(store)/store/customers/_components/invoices/invoices'
import GetItemAction from '@/app/lib/actions/get'

export default async function CustomerInvoicesWrapper({id, page, invoiceQuery, limit = 8}) {
    const endpoint = invoiceQuery
    ? `invoices/search?invoice=${invoiceQuery}&customer_id=${id}&limit=${limit}&invoice_page=${page}`
    : `customers/${id}?limitInvoices=${limit}&pageInvoices=${page}` 
    
   
 
    const response = await GetItemAction(endpoint)
    const {data, error} = response
    let invoices = data?.customer?.invoices || data?.invoices ||[]
    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    return <CustomerInvoices invoices={invoices} searchIsActive={invoiceQuery ? true : false} />

}
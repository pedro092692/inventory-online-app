import SellerInvoices from '@/app/(store)/store/staff/_components/invoices/invoices'
import GetItemAction from '@/app/lib/actions/get'

export default async function SellerInvoicesWrapper({id, page, invoiceQuery, limit = 8}) {
    const endpoint = invoiceQuery
    ? `invoices/search?invoice=${invoiceQuery}&seller_id=${id}&limit=${limit}&invoice_page=${page}`
    : `sellers/${id}?limitInvoices=${limit}&pageInvoices=${page}` 
    
   
 
    const response = await GetItemAction(endpoint)
    const {data, error} = response
    let invoices = data?.seller?.sales || data?.invoices ||[]

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    return <SellerInvoices invoices={invoices} searchIsActive={invoiceQuery ? true : false} seller_id={id}/>

}
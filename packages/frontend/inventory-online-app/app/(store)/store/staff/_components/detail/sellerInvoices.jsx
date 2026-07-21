import CustomerInvoices from '@/app/(store)/store/customers/_components/invoices/invoices'
import GetItemAction from '@/app/lib/actions/get'

export default async function SellerInvoicesWrapper({id, page, invoiceQuery, limit = 8}) {
    const endpoint = invoiceQuery
    ? `invoices/search?invoice=${invoiceQuery}&seller_id=${id}&limit=${limit}&invoice_page=${page}`
    : `sellers/${id}?limitInvoices=${limit}&pageInvoices=${page}` 
    
   
 
    const response = await GetItemAction(endpoint)
    const {data, error} = response
    let invoices = data?.seller?.sales || data?.invoices ||[]
    console.log(invoices)
    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    // return <CustomerInvoices invoices={invoices} searchIsActive={invoiceQuery ? true : false} customer_id={id}/>
    return <p>Seller invoices</p>

}
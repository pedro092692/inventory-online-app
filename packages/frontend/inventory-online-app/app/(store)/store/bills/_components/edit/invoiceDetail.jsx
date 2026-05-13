import GetItemAction from '@/app/lib/actions/get'
import InvoiceDetailForm from '@/app/(store)/store/bills/_components/edit/invoiceDetailForm'

export default async function InvoiceInfo({id}){
    const endpointInvoice = `invoices/${id}`
    const endpointSellers = `sellers/all`

    const [invoiceRes, sellersRes] = await Promise.all([
        GetItemAction(endpointInvoice),
        GetItemAction(endpointSellers)
    ])
    
    const { data: invoiceData, error: invoiceError } = invoiceRes
    const { data: sellersData, error: sellersError } = sellersRes

    const invoice = invoiceData?.invoice || null
    const sellers = sellersData?.sellers || null
    invoice.date = invoice?.date ? new Date(invoice.date).toDateString() : null   

    // await new Promise(resolve => setTimeout(resolve, 2000))

    if (invoiceError || sellersError) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    return (
        <InvoiceDetailForm invoice={invoice} sellers={sellers}/>
    )
}
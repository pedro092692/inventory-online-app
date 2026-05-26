import GetItemAction from '@/app/lib/actions/get'
import PaymentDetailForm from '@/app/(store)/store/bills/_components/edit/paymentDetailForm'


export default async function InvoicePaymentInfo({id}){
    const endpointInvoice = `invoices/${id}`

    const invoiceRes = await GetItemAction(endpointInvoice)
    
    const { data: invoiceData, error: invoiceError } = invoiceRes
    const permission = invoiceData?.permissions || []
    
    const invoice = invoiceData?.invoice || null
    invoice.date = invoice?.date ? new Date(invoice.date).toDateString() : null   

    // await new Promise(resolve => setTimeout(resolve, 2000))

    if (invoiceError) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    return (
        <PaymentDetailForm invoice={invoice} permissions={permission}/>
    )
}
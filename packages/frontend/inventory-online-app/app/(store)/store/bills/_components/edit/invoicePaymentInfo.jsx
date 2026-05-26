import GetItemAction from '@/app/lib/actions/get'
import InvoiceDetailForm from '@/app/(store)/store/bills/_components/edit/invoiceDetailForm'

export default async function InvoicePaymentInfo({id}){
    const endpointInvoice = `invoices/${id}`

    const invoiceRes = await GetItemAction(endpointInvoice)
    
    const { data: invoiceData, error: invoiceError } = invoiceRes

    const invoice = invoiceData?.invoice || null
    invoice.date = invoice?.date ? new Date(invoice.date).toDateString() : null   

    // await new Promise(resolve => setTimeout(resolve, 2000))

    if (invoiceError) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    return (
        <p>Informacion de los metodos de pago de la orden de compra</p>
    )
}
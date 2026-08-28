import GetItemAction from '@/app/lib/actions/get'
import PaymentDetailForm from '@/app/(store)/store/bills/_components/edit/paymentDetailForm'


export default async function InvoicePaymentInfo({id}){
    const endpointInvoice = `invoices/${id}`

    const [invoiceRes, paymentMethodsRes, exchangeRateRes] = await Promise.all([
        GetItemAction(endpointInvoice),
        GetItemAction('payment-methods/all'),
        GetItemAction('dollar-value/latest')
    ])

    const { data: invoiceData, error: invoiceError } = invoiceRes
    const permission = invoiceData?.permissions || []

    const invoice = invoiceData?.invoice || null
    invoice.date = invoice?.date ? new Date(invoice.date).toDateString() : null

    const paymentMethods = paymentMethodsRes?.data?.paymentMethods || []
    const exchangeRate = parseFloat(exchangeRateRes?.data?.lastValue?.value) || null

    // await new Promise(resolve => setTimeout(resolve, 2000))

    if (invoiceError) {
        return <p className='p2-r errorMsg'>{invoiceError}</p>
    }
    return (
        <PaymentDetailForm invoice={invoice} permissions={permission} paymentMethods={paymentMethods} exchangeRate={exchangeRate}/>
    )
}
'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function CreateInvoiceAction(
    msg = 'Operación realizada con éxito 🤑',
    invoiceStatus = false, // true = credit existing invoice, false = create new invoice
    invoiceId = null,
    preState, 
    formData
) {
    // 1. Form Reset Handling
    if (formData.get('reset') === 'true') {
        return {
            message: null,
            errors: {},
            invoice: null,
        }
    }

    const createInvoiceEndpoint = 'invoices'
    const payInvoiceEndpoint = 'pay-invoice'

    // --- CASE 1: CREATE A NEW INVOICE WITH YOUR PAYMENTS ---
    if (!invoiceStatus) {
        const customer = formData.get('customer_id')
        const details = formData.get('details')
        const paymentsRaw = formData.get('payments')

        // Parse the payments coming from the frontend and adapt them to the backend keys
        const paymentsArray = JSON.parse(paymentsRaw || '[]').map(p => ({
            paymentId: parseInt(p.payment_method_id),
            amount: parseFloat(p.amount)
        }))

        const createInvoiceBody = {
            customer_id: customer,
            details: JSON.parse(details || '[]'),
        }

        // A. Create the invoice first
        const response = await Request(createInvoiceEndpoint, 'POST', createInvoiceBody)
        const { data, error } = response

        if (error || !data?.invoice) {
            return {
                message: null,
                errors: error || data?.errors || 'Error al crear la factura.',
                invoice: null
            }
        }
        const newInvoiceId = data.invoice.id

        // B. Send all payments together request to the service.
        const payResponse = await Request(payInvoiceEndpoint, 'POST', {
            invoice_id: newInvoiceId,
            payments: paymentsArray 
        })

        const { data: payData, error: payError } = payResponse

        if (payError || payData?.errors) {
            return {
                message: null,
                errors: payError || payData?.errors || 'La factura se creó pero hubo un problema al registrar los pagos.',
                invoice: data.invoice 
            }
        }

        // C. Actions after success (Revalidation and WhatsApp Link)
        revalidatePath(`/store/${createInvoiceEndpoint}`)
        
        const { data: linkResponse } = await Request(`invoices/send-whatsapp/${newInvoiceId}`, 'GET')

        return {
            message: msg,
            invoice: payData.invoice, 
            ws_link: linkResponse?.link || '',
            errors: {},
            inputs: {}
        }
    }

    // --- CASE 2: PAY AN EXISTING INVOICE (invoiceStatus === true) ---
    if (invoiceStatus && invoiceId) {
        const payment_method_id = formData.get('payment_method_id')
        const amount = formData.get('amount')

        // If payment is made individually from a subscription screen, we send an array of a single element
        const payInvoiceBody = {
            invoiceId: parseInt(invoiceId),
            payments: [
                {
                    paymentId: parseInt(payment_method_id),
                    amount: parseFloat(amount)
                }
            ]
        }

        const payResponse = await Request(payInvoiceEndpoint, 'POST', payInvoiceBody)
        const { data: payData, error: payError } = payResponse

        if (payError || payData?.errors) {
            return {
                message: null,
                errors: payError || payData?.errors || 'Hubo un error al procesar el pago.',
                invoice: null
            }
        }

        revalidatePath(`/store/${createInvoiceEndpoint}`)

        return {
            message: msg,
            invoice: payData.invoice,
            ws_link: '',
            errors: {},
            inputs: {}
        }
    }
}
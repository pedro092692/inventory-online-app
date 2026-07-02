'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function CreateInvoiceAction(
        msg = 'Operacion realizada con éxito 🤑',
        invoiceStatus = false,
        invoiceId = null,
        preStave, formData) {
    
   

    const customer = formData.get('customer_id')
    const payment_method_id = formData.get('payment_method_id')
    const amount = formData.get('amount')
    const details = formData.get('details')
    const payments = formData.get('payments')
    const createInvoiceEndpoint = 'invoices'
    const payInvoiceEndpoint = 'pay-invoice'
    let payInvoiceResponse = null
    let payResponse = null
    let payError = null

    if(formData.get('reset') === 'true'){
        return {
            message: null,
            errors: {},
            invoice: null,
        }
    }

    const createInvoiceBody = {
        customer_id: customer,
        details: JSON.parse(details),
    } 
    
    const payInvoiceBody = {
        invoice_id: invoiceId || null,
        payment_id: parseInt(payment_method_id),
        amount: parseFloat(amount)
    }


    const response = await Request(invoiceStatus ? payInvoiceEndpoint : createInvoiceEndpoint, 
                                        'POST',  invoiceStatus ? payInvoiceBody : createInvoiceBody)
    
    const {data, error} = response 

    if (!invoiceStatus && data?.invoice) {
        payInvoiceBody.invoice_id = data?.invoice.id
        
        for(let payment of JSON.parse(payments)) {
            payInvoiceBody.invoice_id = parseInt(data.invoice.id)
            payInvoiceBody.payment_id = parseInt(payment.payment_method_id)
            payInvoiceBody.amount = parseFloat(payment.amount)

          
            payResponse = await Request(payInvoiceEndpoint, 'POST', payInvoiceBody)

            const {data: payData, error: payError} = payResponse

            if (payError || payData?.errors) {
                return {
                    message: null,
                    errors: data?.errors || payError || 'Hubo un error inesperado intenta nuevamente',
                    inputs: payInvoiceBody
                }
            }
        }

        if(payResponse?.data?.invoice?.status == 'paid') {
            revalidatePath(`/store/${createInvoiceEndpoint}`)
            // create whatslink to send invoice
            const {data: linkResponse, error: linkError} = await Request(`invoices/send-whatsapp/${payInvoiceBody.invoice_id}`, 'GET')
            
            return {
                message: msg,
                invoice: payResponse.data.invoice,
                ws_link: linkResponse?.link || '',
                errors: {},
                inputs: {}
            }
        }  
        
    }
    
 }
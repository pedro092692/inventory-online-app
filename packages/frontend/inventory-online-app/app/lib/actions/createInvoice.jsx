'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function CreateInvoiceAction(
        msg = 'Operacion realizada con éxito',
        preStave, formData) {

    const customer = formData.get('customer_id')
    const payment_method_id = formData.get('payment_method_id')
    const amount = formData.get('amount')
    const details = formData.get('details')
    const body = {}
    const createInvoiceEndpoint = 'invoices'
    const payInvoiceEndpoint = 'pay-invoice'
    
    const createInvoiceBody = {
        customer_id: customer,
        details: JSON.parse(details),
    } 
    
    const payInvoiceBody = {
        invoice_id: null,
        payment_id: parseInt(payment_method_id),
        amount: parseFloat(amount)
    }


    const response = await Request(createInvoiceEndpoint, 'POST', createInvoiceBody)
    
    const payInvoiceResponse = async (body, endpoint) => {
        return await Request(endpoint, 'POST', body)
    }
    
    const {data, error} = response 
    
    if (data?.errors) {
        return {
            message: null,
            errors: data.errors,
            inputs: body
        }
    }

    
    if (error) {
        return {
            message: null, 
            errors: {error: 'Hubo un error inesperado intenta nuevamente'},
            inputs: body
        }
    }

    if (data?.invoice) {
        // pay invoice
        payInvoiceBody.invoice_id = data.invoice?.id || null
        const resPayInvoice = await payInvoiceResponse(payInvoiceBody, payInvoiceEndpoint)
        const {data: dataPayInvoice, error: errorPayInvoice} = resPayInvoice
        const invoiceData  = dataPayInvoice?.invoice || null
        if (invoiceData && invoiceData.status === 'paid') {
            revalidatePath(`/store/${createInvoiceEndpoint}`)
            return {
                message: msg,
                errors: {},
                inputs: {}
            }
        }
    

    }

    return {
        message: msg,
        errors: {},
        inputs: {}
    }
 }
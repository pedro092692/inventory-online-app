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
    
    const createInvoiceBody = {
        customer_id: customer,
        details: JSON.parse(details),
    } 
    


    const response = await Request(createInvoiceEndpoint, 'POST', createInvoiceBody)
    
    const {data, error} = response 

    // console.log(response)
    
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

    return {
        message: msg,
        errors: {},
        inputs: {}
    }
 }
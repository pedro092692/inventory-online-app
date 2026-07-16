'use server'
import Request from '@/app/utils/request'

export default async function AuthorizeAction(
        preStave, formData) {
    
    const pin = formData.get('pin')
    const body = {
        pin: pin
    }
    
    const endpoint = 'sellers/authorize'
    const response = await Request(endpoint, 'POST', body)
    
    const {data, error} = response 
    
    if (data?.errors) {
        return {
            message: null,
            error: data.errors,
            inputs: body
        }
    }

    
    if (error) {
        return {
            message: null, 
            error: 'Hubo un error inesperado intenta nuevamente',
            inputs: body
        }
    }

    return {
        message: 'Autorizando compra a crédito',
        errors: {},
        inputs: {}
    }
 }
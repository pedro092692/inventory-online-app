'use server'
import Request from '@/app/utils/request'

export default async function AddItemAction(
        endpoint, 
        bodyNames = [], 
        msg = 'Operacion realizada con éxito',
        preStave, formData) {
    
    const body = {}
    
    if (!endpoint || !bodyNames) {
        return {
            message: null,
            errors: 'Hubo un error inesperado intenta nuevamente',
            inputs: body
        }
    }     
    
    for (const key of bodyNames) {
        body[key] = formData.get(key)
    }

    const response = await Request(endpoint, 'POST', body)
    
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

    return {
        message: msg,
        errors: {},
        inputs: {}
    }
 }
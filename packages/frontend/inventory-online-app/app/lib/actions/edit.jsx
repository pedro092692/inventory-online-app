'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function EditItemAction(
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
        if(key === 'name') {
            body[key] = formData.get(key).toLowerCase()
            continue
        }
        body[key] = formData.get(key)
    }

    const response = await Request(endpoint, 'PATCH', body)
    
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

    revalidatePath(`/store/${endpoint}`)
    return {
        message: msg,
        errors: {},
        inputs: {}
    }
 }
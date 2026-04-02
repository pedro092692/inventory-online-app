'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function AddBulkAction(preStave, formData) {
    const file = formData.get('file')
    if (!file) {
        return {
            message: null,  
            errors: {error: 'No se ha seleccionado ningún archivo'},
        }
    }
    const form = new FormData()
    form.append('file', file)
    const endpoint = 'products/bulk'

    const response = await Request(endpoint, 'POST', form)
    
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
        }
    }

    return {
        message: 'Productos agregados con éxito',
        errors: {}
    }
 }
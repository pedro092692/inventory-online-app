'use server'
import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import { revalidatePath } from 'next/cache'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function ReturnInvoceItemAction(path = '', msg = '',  prevState, formData) {
    const endpoint = `/api/${path}`
    const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`

    const fetch = withErrorHandler(FetchData)
    const body = 
        {
            itemsToReturn: JSON.parse(formData.get('itemsToReturn')),
            pin: formData.get('pin')

        }
    
    const response = await fetch(url, 'DELETE', body)
    
    const {data, error} = response

    if(error){
        return {
            message: null,
            error: 'Hubo un error inesperado intenta nuevamente'
        }
    }

    if(data?.errors){
        return {
            message: null,
            error: data.errors?.itemsToReturn || 'Hubo un error inesperado intenta nuevamente'
        }
    }

 
    revalidatePath(`/store/${path}`)
    return {
        message: msg ? msg : 'Nota de crédito guardada con éxito',
        error: null
    }
}
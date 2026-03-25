'use server'
import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import { revalidatePath } from 'next/cache'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function DeleteCustomer(id, prevState, formData) {
    const endpoint = `/api/customers`
    const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`

    const fetch = withErrorHandler(FetchData)

    const response = await fetch(url, 'DELETE', {
        customerId: id
    })
    
    const {data, error} = response
    
    if (data?.errors){
        return {
            message: null,
            error: data.errors
        }
    }

    if(error){
        return {
            message: null,
            error: 'Hubo un error inesperado intenta nuevamente'
        }
    }
 
    revalidatePath('/store/customers')
    return {
        message: 'Cliente eliminado con éxito',
        error: null
    }
}
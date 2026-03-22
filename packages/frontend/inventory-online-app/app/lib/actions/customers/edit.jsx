'use server'
import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import { revalidatePath } from 'next/cache'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function editCustomer(id, prevState, formData) {
    const endpoint = `/api/customers/${id}`
    const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`
    
    const fetch = withErrorHandler(FetchData)
    const response = await fetch(url, 'PATCH', {
        name: formData.get('name'),
        id_number: formData.get('id_number'),
        phone: formData.get('cellphone')
    })
    
    const {data, error} = response
    if (data?.errors){
        return {
            message: null,
            errors: data.errors,
            inputs: {
                name: formData.get('name'),
                id_number: formData.get('id_number'),
                phone: formData.get('cellphone')
            }
        }
    }
    
    
    
    revalidatePath(`/store/customers/${id}`)
    return {
        message: 'Ok',
        errors: {}
    }
}
'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function togglePaymentMethodAction(formData) {
    const id = formData.get('id')
    const currentStatus = formData.get('status') === 'true'
    const newStatus = currentStatus ? 'DISABLED' : 'ACTIVE'
    const endpoint = `payment-methods/${id}`
    const response = await Request(endpoint, 'PATCH', {status: newStatus})
    const {data, error} = response 
    if (data?.errors) {
        return {
            message: null,
            errors: data.errors
        }
    }

    if (error) {
        return {
            message: null, 
            errors: {error: 'Hubo un error inesperado intenta nuevamente'},
        }
    }

    revalidatePath(`/store/payment-methods`)
    
    return {
        message: 'Metodo Actualizado.',
        errors: {},
    }

 }
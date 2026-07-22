'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function togglePaymentMethodAction(formData) {
    const id = formData.get('id')
    const currentStatus = formData.get('status') === 'true'
    const newStatus = !currentStatus
    const endpoint = `payment-methods/${id}`
    const response = await Request(endpoint, 'PATCH', {status: newStatus})

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

    revalidatePath(`/store/payment-methods`)
    
    return {
        message: 'Metodo Actualizado.',
        errors: {},
        inputs: {}
    }

 }
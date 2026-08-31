'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function togglePaymentMethodAction(prevState, formData) {
    const id = formData.get('id')
    const currentStatus = formData.get('status') === 'true'
    const newStatus = currentStatus ? 'DISABLED' : 'ACTIVE'
    const endpoint = `payment-methods/${id}`
    const response = await Request(endpoint, 'PATCH', {status: newStatus})
    const {data, error} = response

    if (data?.errors) {
        // The backend sends field errors as { errors: {...} } (validation)
        // but business-rule errors (e.g. LastActivePaymentMethodError) come
        // back as a single string under `errors` — normalize both to the
        // same { error: '...' } shape the UI reads.
        const errors = typeof data.errors === 'string'
            ? { error: data.errors }
            : data.errors

        return {
            message: null,
            errors
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
        message: newStatus === 'ACTIVE' ? 'Método de pago activado.' : 'Método de pago desactivado.',
        errors: {},
    }

 }

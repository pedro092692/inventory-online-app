'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function UpdateBufferRateAction(prevState, formData) {
    const buffer_enabled = formData.get('buffer_enabled') === 'true'
    const buffer_rate = formData.get('buffer_rate')

    const response = await Request('store-settings', 'PATCH', { buffer_enabled, buffer_rate })
    const { data, error } = response

    if (data?.errors) {
        return {
            message: null,
            errors: data.errors,
            inputs: { buffer_enabled, buffer_rate }
        }
    }

    if (error) {
        return {
            message: null,
            errors: { error },
            inputs: { buffer_enabled, buffer_rate }
        }
    }

    revalidatePath('/store/currency')
    revalidatePath('/store/quote')
    revalidatePath('/store/labels')

    return {
        message: 'Configuración guardada con éxito',
        errors: {},
        inputs: {}
    }
}

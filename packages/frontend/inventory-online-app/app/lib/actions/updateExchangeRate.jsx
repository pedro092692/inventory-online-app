'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function UpdateExchangeRateAction(rateId, prevState, formData) {
    const value = formData.get('value')

    const response = await Request(`exchange-rate/${rateId}`, 'PATCH', { value })
    const { data, error } = response

    if (data?.errors) {
        return {
            message: null,
            errors: data.errors,
            inputs: { value }
        }
    }

    if (error) {
        return {
            message: null,
            errors: { error },
            inputs: { value }
        }
    }

    revalidatePath('/admin/exchange-rate')
    return {
        message: 'Tasa actualizada con éxito.',
        errors: {},
        inputs: {}
    }
}

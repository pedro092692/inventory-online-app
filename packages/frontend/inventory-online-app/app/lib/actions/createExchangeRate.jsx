'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function CreateExchangeRateAction(prevState, formData) {
    const value = formData.get('value')

    const response = await Request('exchange-rate', 'POST', { value })
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
        message: 'Tasa registrada con éxito.',
        errors: {},
        inputs: {}
    }
}

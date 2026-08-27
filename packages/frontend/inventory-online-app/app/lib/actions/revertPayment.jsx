'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function RevertPaymentAction(paymentId, prevState, formData) {
    const response = await Request(`users/payments/${paymentId}/revert`, 'PATCH', {})
    const { data, error } = response

    if (data?.errors) {
        return {
            message: null,
            errors: data.errors,
            inputs: {}
        }
    }

    if (error) {
        return {
            message: null,
            errors: { error },
            inputs: {}
        }
    }

    revalidatePath('/admin/payments')
    return {
        message: 'Pago revertido a pendiente.',
        errors: {},
        inputs: {}
    }
}

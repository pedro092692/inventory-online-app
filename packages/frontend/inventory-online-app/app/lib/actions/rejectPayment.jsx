'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function RejectPaymentAction(paymentId, prevState, formData) {
    const reason = formData.get('reason')

    const response = await Request(`users/payments/${paymentId}/reject`, 'PATCH', { reason })
    const { data, error } = response

    if (data?.errors) {
        return {
            message: null,
            errors: data.errors,
            inputs: { reason }
        }
    }

    if (error) {
        return {
            message: null,
            errors: { error },
            inputs: { reason }
        }
    }

    revalidatePath('/admin/payments')
    return {
        message: 'Pago rechazado.',
        errors: {},
        inputs: {}
    }
}

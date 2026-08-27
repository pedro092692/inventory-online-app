'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function ApprovePaymentAction(paymentId, prevState, formData) {
    const response = await Request(`users/payments/${paymentId}/approve`, 'PATCH', {})
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
        message: 'Pago aprobado. Suscripción renovada.',
        errors: {},
        inputs: {}
    }
}

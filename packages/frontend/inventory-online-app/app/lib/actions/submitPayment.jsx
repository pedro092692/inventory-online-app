'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function SubmitPaymentAction(prevState, formData) {
    const amount = formData.get('amount')
    const receipt = formData.get('receipt')

    if (!amount) {
        return {
            message: null,
            errors: { amount: 'Debes indicar el monto pagado.' },
            inputs: { amount }
        }
    }

    if (!receipt || receipt.size === 0) {
        return {
            message: null,
            errors: { error: 'Debes adjuntar el comprobante de pago.' },
            inputs: { amount }
        }
    }

    const form = new FormData()
    form.append('amount', amount)
    form.append('receipt', receipt)

    const response = await Request('store/payments', 'POST', form, 'Hubo un error al enviar el comprobante, intenta nuevamente')
    const { data, error } = response

    if (data?.errors) {
        return {
            message: null,
            errors: data.errors,
            inputs: { amount }
        }
    }

    if (error) {
        return {
            message: null,
            errors: { error },
            inputs: { amount }
        }
    }

    revalidatePath('/store/subscription')
    return {
        message: 'Comprobante enviado. Un administrador lo revisará pronto.',
        errors: {},
        inputs: {}
    }
}

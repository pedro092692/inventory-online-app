'use server'
import Request from '@/app/utils/request'

export default async function AuthorizeAction(
        preStave, formData) {

    const pin = formData.get('pin')
    const body = {
        pin: pin
    }

    const endpoint = 'sellers/authorize'
    const response = await Request(endpoint, 'POST', body)

    const {data, error} = response

    if (data?.errors) {
        // Two shapes can land here: a field-validation failure (e.g. a PIN
        // under 4 characters) comes back as an object keyed by field name;
        // anything else is the backend's message for a wrong or
        // non-supervisor PIN — show that plainly as "PIN inválido".
        const message = typeof data.errors === 'string'
            ? data.errors
            : (Object.values(data.errors)[0] || 'PIN inválido')

        return {
            message: null,
            error: message,
            inputs: body
        }
    }


    if (error) {
        return {
            message: null,
            error: 'Hubo un error inesperado intenta nuevamente',
            inputs: body
        }
    }

    return {
        message: 'Autorizando compra a crédito',
        errors: {},
        inputs: {}
    }
 }

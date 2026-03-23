'use server'
import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function AddCustomerAction(preStave, formData) {
    const inputs = {
        name: formData.get('name'),
        id_number: formData.get('id_number'),
        phone: formData.get('cellphone')
    }

    const endpoint = '/api/customers'
    const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`
    
    const fetch = withErrorHandler(FetchData)
    const response = await fetch(url, 'POST', {
        name: formData.get('name'),
        id_number: formData.get('id_number'),
        phone: formData.get('cellphone'),
    })

    const {data, error} = response 

    if (data?.errors) {
        return {
            message: null,
            errors: data.errors,
            inputs: inputs
        }
    }

    if (error) {
        return {
            message: null, 
            errors: {error: 'Hubo un error inesperado intenta nuevamente'},
            inputs: inputs
        }
    }

    return {
        message: 'Cliente agregado con éxito',
        errors: {},
        inputs: {}
    }
 }
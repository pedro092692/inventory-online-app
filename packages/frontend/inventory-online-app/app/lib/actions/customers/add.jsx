'use server'
import Request from '@/app/utils/request'

export default async function AddCustomerAction(preStave, formData) {
    const inputs = {
        name: formData.get('name'),
        id_number: formData.get('id_number'),
        phone: formData.get('cellphone')
    }
    const body = {
        name: formData.get('name'),
        id_number: formData.get('id_number'),
        phone: formData.get('cellphone'),
    }
    const endpoint = 'customers'
    const response = await Request(endpoint, 'POST', body)
    
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
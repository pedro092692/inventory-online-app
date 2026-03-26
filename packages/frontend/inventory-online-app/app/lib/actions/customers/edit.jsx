'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function editCustomer(id, prevState, formData) { 
    const inputs = {
        name: formData.get('name'),
        id_number: formData.get('id_number'),
        phone: formData.get('cellphone')
    }
    const endpoint = `customers/${id}`
    const body = {
        name: formData.get('name'),
        id_number: formData.get('id_number'),
        phone: formData.get('cellphone')
    }
    const response = await Request(endpoint, 'PATCH', body)

    const {data, error} = response

    if (data?.errors){
        return {
            message: null,
            errors: data.errors,
            inputs: inputs
        }
    }
    
    if (error) {
        return {
            message: null,
            errors: {error:'Hubo un error inesperado intenta nuevamente'},
            inputs: inputs
        }
    }
    
    revalidatePath(`/store/customers/${id}`)
    return {
        message: 'Cliente editado con éxito',
        errors: {},
    }
}
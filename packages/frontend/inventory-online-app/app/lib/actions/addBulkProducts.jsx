'use server'
import Request from '@/app/utils/request'

export default async function AddBulkAction(preStave, formData) {
    const file = formData.get('file')
    if (!file) {
        return {
            message: null,  
            errors: {error: 'No se ha seleccionado ningún archivo'},
        }
    }
    const form = new FormData()
    form.append('file', file)
    const endpoint = 'products/bulk'

    const response = await Request(endpoint, 'POST', form)
    const {data, error} = response 
    

    if (data?.errors) {
        return {
            message: null,
            errors: data.errors
        }
    }

    
    if (error) {
        return {
            message: null, 
            errors: 'Hubo un error inesperado intenta nuevamente',
        }
    }

    return {
        message: data ? `${data.newProducts} nuevos | ${data.productsToUpdate} actualizados | ${data.ignoredProducts} sin cambios`: 'Productos guardados con éxito',
        errors: null
    }
 }
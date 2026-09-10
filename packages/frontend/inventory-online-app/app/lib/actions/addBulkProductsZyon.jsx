'use server'
import Request from '@/app/utils/request'

export default async function AddBulkZyonAction(preStave, formData) {
    const file = formData.get('file')
    const exchangeRate = formData.get('exchangeRate')

    if (!file) {
        return {
            message: null,
            errors: {error: 'No se ha seleccionado ningún archivo'},
        }
    }

    if (!exchangeRate || isNaN(parseFloat(exchangeRate)) || parseFloat(exchangeRate) <= 0) {
        return {
            message: null,
            errors: {error: 'Debes indicar una tasa de cambio válida'},
        }
    }

    const form = new FormData()
    form.append('file', file)
    form.append('exchangeRate', exchangeRate)
    const endpoint = 'products/bulk/zyon'

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
            errors: {error: 'Hubo un error inesperado intenta nuevamente'},
        }
    }

    const skippedNote = data?.skippedCount > 0
        ? ` | ${data.skippedCount} filas omitidas (sin código, precio en 0 o duplicadas)`
        : ''

    return {
        message: data
            ? `${data.newProducts} nuevos | ${data.productsToUpdate} actualizados | ${data.ignoredProducts} sin cambios${skippedNote}`
            : 'Productos guardados con éxito',
        errors: null,
        skippedRows: data?.skippedRows || []
    }
 }

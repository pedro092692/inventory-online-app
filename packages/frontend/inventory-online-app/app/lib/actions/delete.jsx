'use server'
import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import { revalidatePath } from 'next/cache'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function DeleteResource(id, path = '', deleteKey = '', msg = '', typeList = 'store', prevState, formData) {

    const endpoint = `/api/${path === 'staff' ? 'sellers' : path}`
    const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`

    const fetch = withErrorHandler(FetchData)
    const body = deleteKey
    ? { [deleteKey]: id}
    : {
        id: id
    }
    const response = await fetch(url, 'DELETE', body)
    const {data, error} = response

    if (data?.errors){
        return {
            message: null,
            error: data.errors
        }
    }

    if(error){
        return {
            message: null,
            error: 'Hubo un error inesperado intenta nuevamente'
        }
    }

    // `typeList` picks the right base ('store' vs 'admin') so this revalidates the page the
    // list actually lives on — without it, an admin-side delete (e.g. exchange rates, users)
    // would revalidate '/store/...' instead of '/admin/...' and the list wouldn't refresh.
    revalidatePath(`/${typeList === 'store' ? 'store' : 'admin'}/${path}`)
    return {
        message: msg ? msg : 'Elemento eliminado con éxito',
        error: null
    }
}
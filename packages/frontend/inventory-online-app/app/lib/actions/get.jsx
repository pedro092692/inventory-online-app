'use server'
import Request from '@/app/utils/request'
import { revalidatePath } from 'next/cache'

export default async function GetItemAction(endpoint) {
    
    if(!endpoint) {
        return {
            data: null,
            error: 'Hubo un error inesperado intenta nuevamente'
        }
    }
   
    const response = await Request(endpoint, 'GET')
    
    return response
 }
 
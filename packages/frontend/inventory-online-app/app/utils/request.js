import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function Request(endpoint, method = 'GET', body = null, errorMgs = null){
    if(!endpoint ) {
        return {
            data: null,
            error: 'Endpoin is required'
        }
    }
  
    const url = `${NEXT_PUBLIC_API_BASE_URL}/api/${endpoint}`
    const fetch = withErrorHandler(FetchData, errorMgs ? errorMgs : null)
    const response = await fetch(url, method, body)
    
    return response 

}
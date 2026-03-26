import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'

export default async function Request(url, method = 'GET', body = null){
    if(!url ) {
        return {
            data: null,
            error: 'Url is required'
        }
    }
    
    const fetch = withErrorHandler(FetchData)
    const response = await fetch(url, method, body)
    return response 

}
import fetchData from '@/app/utils/fetchData'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

async function deleteResource(urlPath, body) {
    try{
        const response = await fetchData(`${NEXT_PUBLIC_API_BASE_URL}/api/${urlPath}`, 
            'DELETE',
            body ? body: null
        )
        if(!response) {
            return 1
        }
    }catch(error){
        if (error.status === 400 && (error.message.error)) { 
            return error.message.error
        }
    }   
}

export { deleteResource }

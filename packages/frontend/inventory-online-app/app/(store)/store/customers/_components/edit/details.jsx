import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import CustomerDetailForm from '@/app/(store)/store/customers/_components/edit/EditFormDetail'

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function EditDetails({id}) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const endpoint = `/api/customers/${id}`
    const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}?limitInvoices=0`
    const fetch = withErrorHandler(FetchData, 'Hubo un error inesperado intententa nuevamente')
    const response = await fetch(url, 'GET')
    const {data, error} = response
 
    const customer = data?.customer || null

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    
    return (
        <CustomerDetailForm customer={customer}/>
    )
}


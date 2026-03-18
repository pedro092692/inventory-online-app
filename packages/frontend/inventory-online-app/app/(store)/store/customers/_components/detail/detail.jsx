import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import CustomerDetailForm from '@/app/(store)/store/customers/_components/detail/formDetail'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function CustomerInfo({id}) {
    
    const endpoint = `/api/customers/${id}`
    const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`
    const fetch = withErrorHandler(FetchData, 'hubo un error inesperado')
    const response = await fetch(url, 'GET')
    const {data, error} = response
    const customer = data?.customer || null
    

    
    return (
        <CustomerDetailForm customer={customer}/>
    )
    
}
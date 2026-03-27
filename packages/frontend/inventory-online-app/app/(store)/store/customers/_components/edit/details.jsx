import Request from '@/app/utils/request'
import CustomerDetailForm from '@/app/(store)/store/customers/_components/edit/EditFormDetail'

export default async function CustomerInfo({id}) {
    
    const endpoint = `customers/${id}`
    const url = `${endpoint}?limitInvoices=0`
    const response = await  Request(url, 'GET', null, 'Hubo un error inesperado intententa nuevamente')
    const {data, error} = response
 
    const customer = data?.customer || null
    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    
    return (
        <CustomerDetailForm customer={customer}/>
    )
}


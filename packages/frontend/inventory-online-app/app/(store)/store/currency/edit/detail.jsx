import Request from '@/app/utils/request'


export default async function CustomerInfo({id}) {
    
    const endpoint = `dollar-value/${id}`
    const url = `${endpoint}?limitInvoices=0`
    const response = await  Request(url, 'GET', null, 'Hubo un error inesperado intententa nuevamente')
    const {data, error} = response
 
    const customer = data?.customer || null
    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    
    return (
        <p>Details here</p>
    )
}
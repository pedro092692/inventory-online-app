import Request from '@/app/utils/request'


export default async function StaffInfo({id}) {
    
    const endpoint = `sellers/${id}`
    const url = `${endpoint}?limitInvoices=0`
    const response = await  Request(url, 'GET', null, 'Hubo un error inesperado intententa nuevamente')
    const {data, error} = response
 
    const seller = data?.seller || null
    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    
    return (
       <p>Hi staff</p>
    )
}

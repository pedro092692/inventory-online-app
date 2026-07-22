import Request from '@/app/utils/request'


export default async function CurrencyInfo({id}) {
    
    const url = `dollar-value/${id}`
    const response = await  Request(url, 'GET', null, 'Hubo un error inesperado intententa nuevamente')
    const {data, error} = response
 
    const currencyData = data?.currencyData || null
    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    console.log(currencyData)
    return (
        <p>Details here</p>
    )
}
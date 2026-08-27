import Request from '@/app/utils/request'
import ExchangeRateDetailForm from '@/app/(admin)/admin/exchange-rate/_components/edit/exchangeRateDetailForm'

export default async function ExchangeRateInfo({id}) {
    const url = `exchange-rate/${id}`
    const response = await Request(url, 'GET', null, 'Hubo un error inesperado intenta nuevamente')
    const { data, error } = response

    const rateData = data?.rate || null

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    return (
        <ExchangeRateDetailForm data={rateData}/>
    )
}

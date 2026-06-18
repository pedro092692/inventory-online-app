import SellForm from '@/app/(store)/store/sell/_components/sellForm'
import GetItemAction from '@/app/lib/actions/get'


export default async function Sell() {
    const endpoint = 'payment-methods/all'
    const [response, exchangeRateResponse] = await Promise.all([
        GetItemAction(endpoint),
        GetItemAction('dollar-value/latest'),
        GetItemAction('payment-methods/all')
    ])
    const {data, error} = response
    const {data: exchangeRateData, error: exchangeRateError} = exchangeRateResponse

    const paymentMethods = data?.paymentMethods || []
    const exchangeRate = parseFloat(exchangeRateData?.lastValue?.value) || null

    if (error || exchangeRateError) {
        return <p className='p2-r errorMsg'>{error || exchangeRateError}</p>
    }

    return (
        <SellForm paymentMethods={paymentMethods} exchangeRate={exchangeRate}/>
    )
}
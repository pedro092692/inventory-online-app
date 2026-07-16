import SellForm from '@/app/(store)/store/sell/_components/sellForm'
import GetItemAction from '@/app/lib/actions/get'


export default async function Sell() {
    const endpoint = 'payment-methods/all'
    const perEndpoint = 'security/current-user'
    const [response, exchangeRateResponse, perResponse] = await Promise.all([
        GetItemAction(endpoint),
        GetItemAction('dollar-value/latest'),
        GetItemAction(perEndpoint)
    ])
    const {data, error} = response
    const {data: exchangeRateData, error: exchangeRateError} = exchangeRateResponse
    const {data: permissionsResponse, error: permissionsError} = perResponse

    const paymentMethods = data?.paymentMethods || []
    const exchangeRate = parseFloat(exchangeRateData?.lastValue?.value) || null
    const permissions = permissionsResponse || null

    if (error || exchangeRateError || permissionsError) {
        return <p className='p2-r errorMsg'>{error || exchangeRateError || permissionsError || 'Also salio mal intenta nuevamente'}</p>
    }

    return (
        <SellForm paymentMethods={paymentMethods} exchangeRate={exchangeRate} currentUser={permissions}/>
    )
}
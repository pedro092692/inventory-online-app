import SellForm from '@/app/(store)/store/sell/_components/sellForm'
import GetItemAction from '@/app/lib/actions/get'


export default async function Sell() {
    const endpoint = 'payment-methods/all'
    const response = await GetItemAction(endpoint)
    const { data, error } = response
    const paymentMethods = data?.paymentMethods || []
    
    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    return (
        <SellForm paymentMethods={paymentMethods}/>
    )
}
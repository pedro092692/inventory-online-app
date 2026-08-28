import GetItemAction from '@/app/lib/actions/get'
import QuoteForm from '@/app/(store)/store/quote/_components/quoteForm'

export default async function Quote() {
    const exchangeRateResponse = await GetItemAction('dollar-value/latest')
    const { data: exchangeRateData, error } = exchangeRateResponse
    const exchangeRate = parseFloat(exchangeRateData?.lastValue?.value) || null

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    return (
        <QuoteForm exchangeRate={exchangeRate} />
    )
}

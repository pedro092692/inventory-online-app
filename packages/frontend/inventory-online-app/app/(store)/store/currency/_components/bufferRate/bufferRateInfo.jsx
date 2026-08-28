import GetItemAction from '@/app/lib/actions/get'
import BufferRateForm from '@/app/(store)/store/currency/_components/bufferRate/bufferRateForm'

export default async function BufferRateInfo() {
    const response = await GetItemAction('store-settings', 'Hubo un error inesperado intenta nuevamente')
    const { data, error } = response
    const settings = data?.settings || null
    const officialRate = data?.official_rate ?? null
    const bufferIsStale = data?.buffer_is_stale ?? false

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    return <BufferRateForm settings={settings} officialRate={officialRate} bufferIsStale={bufferIsStale} />
}

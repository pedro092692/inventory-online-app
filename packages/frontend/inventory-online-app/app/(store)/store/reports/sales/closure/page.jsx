import ClosureSalesData from '@/app/(store)/store/reports/_components/sales/closureData'
import GetItemAction from '@/app/lib/actions/get'

export default async function ClosureReport({searchParams}) {
    const params = await searchParams
    const seller_id = params?.sellerId || null
    const date = params?.date || null
    const sellers = null
    return (
        <ClosureSalesData seller_id={seller_id} date={date}/>
    )
}
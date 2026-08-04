import ClosureSalesData from '@/app/(store)/store/reports/_components/sales/closureData'
import GetItemAction from '@/app/lib/actions/get'
import ReportFilters from '@/app/(store)/store/reports/_components/sales/closure/reportFilter'


export default async function ClosureReport({searchParams}) {
    const params = await searchParams
    const seller_id = params?.sellerId || null
    const date = params?.date || null
    const seller_response = await GetItemAction('sellers/all-names', 'Hubo un error inesperado')
    const sellers = seller_response?.data?.sellers || []

    return (
        <div>
            <ReportFilters date={date} sellerId={seller_id} sellers={sellers} />
            <ClosureSalesData seller_id={seller_id} date={date} />
        </div>
        
    )
}
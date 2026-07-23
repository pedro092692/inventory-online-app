import GetItemAction from '@/app/lib/actions/get'
import TopSpendersReport from '@/app/(store)/store/reports/_components/customers/topSpender'


export default async function TopSpenders() {
    const endpoint = 'top-spending-customers'
    const url = `reports/${endpoint}`
    const response = await GetItemAction(url, 'Hubo un error inesperado intenta nuevamente')
    const {data, error} = response
    const topSpenders = data
    
    return (
        <TopSpendersReport data={topSpenders}/>
    )   
}
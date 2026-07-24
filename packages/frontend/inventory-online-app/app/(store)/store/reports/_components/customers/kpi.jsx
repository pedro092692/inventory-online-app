import GetItemAction from '@/app/lib/actions/get'
import KpiCard from '@/app/(store)/store/reports/_components/kpiCards/kpiCards'
import {Container} from '@/app/ui/utils/container'
import { Users, Repeat2, Package, Phone, Calendar, Trophy, DollarSign} from 'lucide-react'


export default async function CustomerKPI({}) {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    const endpoint = 'customers-kpi'
        const url = `reports/${endpoint}`
        const response = await GetItemAction(url, 'Hubo un error inesperado intenta nuevamente')
        const {data, error} = response
        const kpi = data?.kpi || {}
        
    if (error) {
        return (
            <p className='p2-r errorMsg'>{error}</p>
        )  
    }

    return (
        <Container
            padding={'0px 24px'}
            width={'100%'}
            // justifyContent={'space-between'}
            justifyContent={'flex-start'}
            gap={'32px'}
        >
                <KpiCard label={'Clientes'} value={kpi.total_customers} icon={Users} />
                <KpiCard label={'Ticket Promedio'} value={`$${kpi.avg_ticket}`} icon={DollarSign} />
                <KpiCard label={'Mayor gasto por cliente'} value={`$${kpi.top_spender}`} icon={Trophy} />
                <KpiCard label={'Cliente más recurrente'} value={kpi.top_recurring} icon={Repeat2} />
        </Container>
        
    )
}
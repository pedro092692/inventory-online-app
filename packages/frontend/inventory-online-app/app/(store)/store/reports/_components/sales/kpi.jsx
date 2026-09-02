import GetItemAction from '@/app/lib/actions/get'
import KpiCard from '@/app/(store)/store/reports/_components/kpiCards/kpiCards'
import styles from './kpi.module.css'
import {Container} from '@/app/ui/utils/container'
import { Package, TrendingUp, Trophy, DollarSign} from 'lucide-react'
import Link from 'next/link'


export default async function SaleKPI({}) {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    const endpoint = 'sales-kpi'
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
            gap={'32px'}
            flexWrap={'wrap'}
            className={styles.kpiContainer}
        >
                <KpiCard label={'Unidades vendidas (30 días)'} value={kpi.total_products} icon={Package} />
                <KpiCard label={'Ingresos (30 días)'} value={`$${kpi.revenue}`} icon={DollarSign} />
                <KpiCard label={`Mejor día ${kpi.best_day_date}`} value={`${kpi.best_day_value}`} icon={Trophy} />
                <Link href={`/store/bills/detail/${kpi.best_invoice_id}`}>
                    <KpiCard label={`Venta más alta`} value={kpi.best_invoice_value} icon={TrendingUp} />
                </Link>
                
        </Container>
        
    )
}
import GetItemAction from '@/app/lib/actions/get'
import KpiCard from '@/app/(store)/store/reports/_components/kpiCards/kpiCards'
import {Container} from '@/app/ui/utils/container'
import { Users, Repeat2, Package, Boxes, Warehouse, BadgeDollarSign} from 'lucide-react'


export default async function ProductKPI({}) {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    const endpoint = 'products-kpi'
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
                <KpiCard label={'Productos registrados'} value={kpi.total_products} icon={Package} />
                <KpiCard label={'Valor de inventario (costo)'} value={`$${new Intl.NumberFormat('es-VE').format(kpi.inventory_value)}`} icon={Warehouse} />
                <KpiCard label={'Valor de venta estimado'} value={`$${new Intl.NumberFormat('es-Ve').format(kpi.inventory_value_sale)}`} icon={BadgeDollarSign} />
                <KpiCard label={'Unidades en stock'} value={`${new Intl.NumberFormat('es-Ve').format(kpi.inventory_items)}`} icon={Boxes} />
        </Container>
        
    )
}
import GetItemAction from '@/app/lib/actions/get'
import LineChart from '@/app/(store)/store/reports/_components/charts/line/linechart'
import ChartSection from '../charts/sectionChart' 
import { TrendingUp } from 'lucide-react'


export default async function SalesPerDay() {
    // await new Promise (r => setTimeout(r, 1000))
    const endpoint = 'sales-per-day'
    const url = `reports/${endpoint}`
    const response = await GetItemAction(url, 'Hubo un error inesperado intenta nuevamente')
    const {data, error} = response
    const rawData = data 

    const salesData = rawData.map(item  => {
        return {
            day: new Date(item.day).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            sales: parseInt(item.sales, 10),
            revenue: parseFloat(item.revenue)
        }
    })
    const total_sales = salesData.reduce((acc, d) => acc + d.revenue, 0)
    return (
        <ChartSection title="Ventas e ingresos de los ultimos 30 días" subtitle="Barras = unidades vendidas · línea = ingresos generados"  icon={TrendingUp}>
            <LineChart  dailySales={salesData} />
        </ChartSection> 
    ) 
}
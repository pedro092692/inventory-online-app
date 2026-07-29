import GetItemAction from '@/app/lib/actions/get'
import ChartSection from '../charts/sectionChart' 
import ColumnChart from '@/app/(store)/store/reports/_components/charts/barchart/columnChart'
import { CalendarDays } from 'lucide-react'


export default async function BestDayOfWeekPattern() {
    // await new Promise (r => setTimeout(r, 1000))
    const endpoint = 'peak-day-week'
    const url = `reports/${endpoint}`
    const response = await GetItemAction(url, 'Hubo un error inesperado intenta nuevamente')
    const {data, error} = response
    const rawData = data 
    const DAY_ORDER = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]
    const bestDaysOfWeekData = rawData.map(d => ({
        name: d.dayOfWeek,
        value: parseFloat(d.totalRevenue),
        transactions: parseInt(d.totalSales, 10),
    })).sort((a, b) => DAY_ORDER.indexOf(a.name) - DAY_ORDER.indexOf(b.name))

    
   
    return (
        <ChartSection title="Días de la semana con más ventas" subtitle="Ingresos acumulados por día"  icon={CalendarDays}>
            <ColumnChart data={bestDaysOfWeekData} type='days'/>
        </ChartSection> 
    ) 
}
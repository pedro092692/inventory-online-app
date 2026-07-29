import GetItemAction from '@/app/lib/actions/get'
import ChartSection from '../charts/sectionChart' 
import ColumnChart from '@/app/(store)/store/reports/_components/charts/barchart/columnChart'
import { Clock } from 'lucide-react'


export default async function SalesPeakHourPatterns() {
    // await new Promise (r => setTimeout(r, 1000))
    const endpoint = 'peak-sales-hour'
    const url = `reports/${endpoint}`
    const response = await GetItemAction(url, 'Hubo un error inesperado intenta nuevamente')
    const {data, error} = response
    const rawData = data 
    
    function formatHourRange(hour) {
        const h = parseInt(hour, 10)
        const nextH = (h + 1) % 24
        const pad = (n) => String(n).padStart(2, "0")
        return `${pad(h)}:00 - ${pad(nextH)}:00`
    }

    const peakHourData = rawData.map(data => ({
        name: formatHourRange(data.hourOfDay),
        value: parseFloat(data.revenue),
        transactions: parseInt(data.Sales, 10),
    }))

   
    return (
        <ChartSection title="Horas pico de venta" subtitle="Top 3 franjas horarias con más ingresos"  icon={Clock}>
            <ColumnChart data={peakHourData}/>
        </ChartSection> 
    ) 
}
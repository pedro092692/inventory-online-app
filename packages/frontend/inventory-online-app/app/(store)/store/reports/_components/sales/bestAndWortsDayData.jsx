import GetItemAction from '@/app/lib/actions/get'
import ChartSection from '../charts/sectionChart' 
import BesWorstChart from '@/app/(store)/store/reports/_components/charts/barchart/bestWorstChart'
import { ArrowUpDown } from 'lucide-react'


export default async function BestWorstDays() {
    // await new Promise (r => setTimeout(r, 1000))
    const best_days_url = `reports/best-selling-day`
    const worst_says_url = `reports/worst-selling-day`
    const [best_days_response, worst_days_response] = await Promise.all([
        GetItemAction(best_days_url, 'Hubo un error inesperado intenta nuevamente'),
        GetItemAction(worst_says_url, 'Hubo un error inesperado intenta nuevamente')
    ])
    const { data: best_days_raw_data } = best_days_response
    const { data: worst_days_raw_data } = worst_days_response

    const mapBesWorstDays = (bestRaw, worstRaw) => {
        const best = bestRaw.map((d) => ({
            name: new Date(d.day).toLocaleDateString('es-ES', { day: '2-digit', month: 'short'}),
            value: parseFloat(d.revenue),
            kind: 'best'
        }))

        const worst = worstRaw.map((d) => ({
            name: new Date(d.day).toLocaleDateString('es-Es', { day: '2-digit', month: 'short'}),
            value: parseFloat(d.revenue),
            kind: 'worts'
        })).sort((a, b) => a.value - b.value)

        return {best, worst}
    }

    const { best, worst } = mapBesWorstDays(best_days_raw_data, worst_days_raw_data)

   
    return (
        <ChartSection title="Mejores y peores días del periodo" subtitle="Top 5 mejores en verde, top 5 peores en rojo"  icon={ArrowUpDown}>
            <BesWorstChart bestDays={best} worstDays={worst}/>
        </ChartSection> 
    ) 
}
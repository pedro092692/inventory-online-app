import GetItemAction from '@/app/lib/actions/get'
import ChartSection from '../charts/sectionChart' 
import DonutChart from '@/app/(store)/store/reports/_components/charts/donut/donut'
import MultiLineChart from '@/app/(store)/store/reports/_components/charts/line/multiLine'
import {Container} from '@/app/ui/utils/container'
import { PieChart, TrendingUp } from 'lucide-react'


export default async function DetailsSales() {
    // await new Promise (r => setTimeout(r, 1000))
    const url = `reports/detail-sales`
    const response = await GetItemAction(url, 'Hubo un error inesperado intenta nuevamente')
    const {data, error} = response
    const rawData = data 
    const METHOD_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"]
    
    const normalizeDetailData = (raw) => {
        const byMethod = new Map()
        const byCurrency = new Map()
        const daysSet = new Set()

        let totalUsd = 0
        let totalTxn = 0

        for (const row of raw) {
            const day = String(row.day).slice(0, 10)
            const usd = parseFloat(row.total_dollar) || 0
            const txn = parseInt(row.transactions, 10) || 0
            const method = row.payment
            const currency = row.currency

            totalUsd += usd
            totalTxn += txn
            daysSet.add(day)

            if (!byMethod.has(method)) {
                byMethod.set(method, { name: method, currency, usd: 0, txn: 0, byDay: {} });
            }

            const m = byMethod.get(method)
            m.usd += usd
            m.txn += txn
            m.byDay[day] = (m.byDay[day] || 0) + usd

            if (!byCurrency.has(currency)) {
                byCurrency.set(currency, { name: currency, usd: 0, txn: 0 });
            }

            const c = byCurrency.get(currency);
            c.usd += usd;
            c.txn += txn;
        }

        let methods = [...byMethod.values()]
            .sort((a, b) => b.usd - a.usd)
            .map((m, i) => ({ ...m, usd: round2(m.usd), color: METHOD_COLORS[i] || "#888" }))

        methods = distributePercentages(methods.map((m) => ({ ...m, rawValue: m.usd })), "pctUsd", round2(totalUsd))
        methods = distributePercentages(methods.map((m) => ({ ...m, rawValue: m.txn })), "pctTxn", totalTxn)
            .map(({ rawValue, ...m }) => m)

        const currencies = [...byCurrency.values()]
            .map((c) => ({ ...c, usd: round2(c.usd), pct: totalUsd ? Math.round((c.usd / totalUsd) * 100) : 0 }))
            .sort((a, b) => b.usd - a.usd)
        
        return { methods, currencies, totalUsd: round2(totalUsd), totalTxn, days: [...daysSet].sort() }

    }

    const buildTrendSeries = (methods, days) => {
        if (!days.length || !methods.length) return { datasets: [], merged: [] }
        const start = new Date(days[0])
        const end = new Date(days[days.length - 1])
        const allDays = []
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            allDays.push(d.toISOString().slice(0, 10));
        }

        const top = methods.slice(0, 4)
        const datasets = top.map((m, i) => ({ key: `m${i}`, name: m.name, color: m.color }))

        const merged = allDays.map((d) => {
            const row = { day: new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }) }
            top.forEach((m, i) => {
                row[`m${i}`] = round2(m.byDay[d] || 0)
            })
            return row
        })
        
        return { datasets, merged }
    }

    const distributePercentages = (items, key, total) => {
        if (!total) return items.map((it) => ({ ...it, [key]: 0 }))
        const exact = items.map((it) => (it.rawValue / total) * 100)
        const floors = exact.map(Math.floor)
        const resto = 100 - floors.reduce((a, b) => a + b, 0)
        const orden = exact
            .map((v, i) => ({ i, frac: v - Math.floor(v) }))
            .sort((a, b) => b.frac - a.frac)
        const extra = new Set()
        for (let k = 0; k < resto && k < orden.length; k++) extra.add(orden[k].i)
        return items.map((it, i) => ({ ...it, [key]: floors[i] + (extra.has(i) ? 1 : 0) }))

    }

    const round2 = (n) => Math.round(n * 100) / 100

    const detail = normalizeDetailData(rawData, [])
    const trendData = buildTrendSeries(detail.methods, detail.days)
    const detailMethods = detail.methods;
    const totalUsd    = detail.totalUsd;
    const totalTxn    = detail.totalTxn;
    const topMethod   = detailMethods[0]?.name ?? "—"

   
   
    return (
        <Container
            padding={'0px'}
            gap={'16px'}
            width={'100%'}
        >
            <ChartSection title="Distribución por método" subtitle="% del total en USD"  icon={PieChart}>
                <DonutChart methods={detailMethods} totalUsd={totalUsd} />
            </ChartSection> 

            <ChartSection title="Tendencia por método (USD)" subtitle="Top 4 métodos — últimos 30 días"  icon={TrendingUp}>
                <MultiLineChart datasets={trendData.datasets} merged={trendData.merged} />
            </ChartSection> 
        </Container>
        
        
    ) 
}
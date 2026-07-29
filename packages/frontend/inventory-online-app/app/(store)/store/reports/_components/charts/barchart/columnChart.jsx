'use client'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList,} from 'recharts'
import { Users, Repeat2, Package, Phone, Calendar, Trophy } from "lucide-react"

export default function ColumnChart({data, type = 'hours'}) {
    const palette = {
        navy: "#1B4279",
        primary: "#12113B",
        gold: "#C9A227",
        teal: "#2F7C74",
        bg: "#F6F5F1",
        card: "#FFFFFF",
        muted: "#6B7280",
        grid: "#E7E4DC",
    }

    const rankFill = (index, base) => {
        if (index === 0) return palette.gold;
        if (index === 1) return "#B8B4A8";
        if (index === 2) return "#C08A5B";
        return base
    }

    const SimpleColumnTooltip = ({ active, payload, label, valuePrefix }) => {
        if (!active || !payload || !payload.length) return null
        const d = payload[0].payload
        return (
            <div
                style={{
                    background: palette.navy,
                    color: "#fff",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 16,
                    lineHeight: 1.5,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                }}
            >
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
                <div>
                    {valuePrefix}
                    {d.value.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                </div>
                {d.transactions != null && <div style={{ opacity: 0.8 }}>{d.transactions} transacciones</div>}
            </div>
        )
    }

    const ColumnChartFn = ({ data, color, valuePrefix = "$" }) => {
        return (
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid vertical={false} stroke={palette.grid} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: palette.muted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: palette.muted }} axisLine={false} tickLine={false} width={40} />
                    
                    <Tooltip content={<SimpleColumnTooltip valuePrefix={valuePrefix} />} cursor={{ fill: "rgba(23,40,75,0.04)" }} />
                    
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
                        {data.map((_, i) => (
                            <Cell key={i} fill={_.value === Math.max(...data.map((x) => x.value)) ? palette.gold : color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        )
    }

    return (
        <ColumnChartFn data={data} color={type == 'hours' ? palette.navy : palette.teal}/>
    )
}
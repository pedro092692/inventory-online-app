'use client'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList,
} from 'recharts'


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
export default function MultiLineChart({ datasets = [], merged = []  }) {

    const TrendTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null
        return (
            <div style={{ background: palette.navy, color: "#fff", borderRadius: 10, padding: "10px 14px", fontSize: 13, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
                {payload.map((p) => (
                    <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                        {p.name}: <b>${p.value?.toLocaleString("es-ES", { minimumFractionDigits: 2 })}</b>
                    </div>
                ))}
            </div>
        )

    } 

    const TrendChart = ({ datasets, merged }) => {
        if (!datasets.length || !merged.length) {
            return <div style={{ padding: 24, textAlign: "center", fontSize: 13, color: palette.muted }}>Sin datos en el periodo</div>
        }

        return (
            <ResponsiveContainer width="100%" height={410}>
                <ComposedChart data={merged} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
                    <XAxis
                        dataKey="day"
                        tick={{ fontSize: 11, fill: palette.muted }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                        minTickGap={28}
                    />
                    <YAxis tick={{ fontSize: 11, fill: palette.muted }} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => `$${v}`} />
                    <Tooltip content={<TrendTooltip />} cursor={{ stroke: palette.muted, strokeDasharray: "3 3" }} />
                    {datasets.map((ds) => (
                        <Line
                            key={ds.key}
                            dataKey={ds.key}
                            name={ds.name}
                            stroke={ds.color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    ))}
                </ComposedChart>
            </ResponsiveContainer>
        )
    }

    return <TrendChart datasets={datasets} merged={merged} />
}

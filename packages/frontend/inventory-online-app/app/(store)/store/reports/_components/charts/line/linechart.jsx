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
export default function LineChart({ dailySales }) {

    const DailySalesTooltip = ({active, payload, label}) => {
    
        if (!active || !payload || !payload.length) return null
        const sales = payload.find((p) => p.dataKey === 'sales')?.value
        const revenue = payload.find((p) => p.dataKey === 'revenue')?.value

        return (
            <div
                style={{
                    background: palette.primary,
                    color: "#fff",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 18,
                    lineHeight: 1.5,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                }}
            >
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
                <div>Ventas: <b>{sales}</b></div>
                <div>Ingresos: <b>${revenue?.toLocaleString("es-VE", { minimumFractionDigits: 2 })}</b></div>
            </div>
        )
    }


    const DailySalesChart = ({data}) => {
        return (
            <ResponsiveContainer width="100%" height={340}>
                 <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
                    
                    <XAxis
                        dataKey="day"
                        tick={{ fontSize: 14, fill: palette.muted }}
                        axisLine={false}
                        tickLine={false}
                        interval={2}
                    />
                    
                    <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 11, fill: palette.muted }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                    />

                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 11, fill: palette.muted }}
                        axisLine={false}
                        tickLine={false}
                        width={44}
                        tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip content={<DailySalesTooltip />} cursor={{ fill: "rgba(23,40,75,0.04)" }} />

                    <Legend
                        verticalAlign="top"
                        align="right"
                        height={30}
                        iconType="circle"
                        wrapperStyle={{ fontSize: 14, color: palette.muted }}
                    />
                    
                    <Bar yAxisId="left" dataKey="sales" fill={palette.navy} radius={[4, 4, 0, 0]} barSize={24} name="Ventas" />

                    <Line
                        yAxisId="right"
                        dataKey="revenue"
                        stroke={palette.gold}
                        strokeWidth={2.5}
                        dot={false}
                        name="Ingresos"
                    />
                    
                 </ComposedChart>
            </ResponsiveContainer>
        )
    }

    return <DailySalesChart data={dailySales} />
}



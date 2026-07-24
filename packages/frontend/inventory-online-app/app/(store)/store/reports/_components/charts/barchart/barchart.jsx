'use client'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList,} from 'recharts'
import { Users, Repeat2, Package, Phone, Calendar, Trophy } from "lucide-react"


export default function Barchart({ data = [], keys = [], type = null}) {
   
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
    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null

        const d = payload[0].payload

        return (
            <div style={{
                background: palette.primary,
                color: "#fff",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 16,
                lineHeight: 1.5,
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.name}</div>

                {
                    type === 'spending' && (
                        <>
                            <div>Total gastado: <b>${d.total_spent.toLocaleString("es-ES", { minimumFractionDigits: 2 })}</b></div>
                            <div style={{ opacity: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
                                <Phone size={12} /> {d.phone}
                            </div>
                            <div style={{ opacity: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
                                <Calendar size={12} /> última compra {d.last_purchase}
                            </div>
                        </>
                    )
                }

                {
                    type === 'recurring' && (
                        <>
                            <div>Compras registradas: <b>{d.value}</b></div>
                            <div style={{ opacity: 0.8, }}>Cliente desde hace {d.daysAsCustomer} días</div>
                            <div style={{ opacity: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
                                <Phone size={12} /> {d.phone}
                            </div>
                        </>
                    )
                }
            </div>
        )
    }

    const RankedBarChart = ({ data, type, keys = [], barColor, height }) => {
        return (
            <ResponsiveContainer width="100%" height={height || Math.max(220, data.length * 56)}>
                <BarChart data={data} layout="vertical" margin={{ top: 4, right: 64, left: 8, bottom: 4 }}>
                    <CartesianGrid horizontal={false} stroke={palette.grid} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: palette.muted }} axisLine={false} tickLine={false} />
                    <YAxis
                        type="category"
                        dataKey={keys[0]}
                        width={140}
                        tick={{ fontSize: 16, fill: 'black', fontWeight: 400 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip type={type} />} cursor={{ fill: "rgba(23,40,75,0.04)" }} />
                    <Bar dataKey={keys[1]} radius={[0, 4, 4, 0]} barSize={24}>
                        {data.map((_, i) => (
                            <Cell key={i} fill={rankFill(i, barColor)} />
                        ))}
                        <LabelList
                        dataKey={keys[1]}
                        position="right"
                        formatter={(v) => (type === "spending" ? `$${v.toLocaleString("es-ES")}` : v)}
                            style={{ fill: 'black', fontWeight: 500, fontSize: 16 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        )
    }

    return (
        <RankedBarChart data={data} type={type} keys={keys} barColor={type == 'spending' ?  palette.navy : palette.teal } />
    )
}
'use client'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts'
import { Users, Repeat2, Package, Phone, Calendar, Trophy } from "lucide-react"


export default function TopSpendersReport({ topSpenders = [] }) {
    // 1. set data to chart
    const chartData = topSpenders.map(({id, name, total_spent, first_purchase, last_purchase, phone}) => {
        return {
            id,
            name,
            total_spent: parseFloat(total_spent),
            first_purchase,
            last_purchase,
            phone
            
        }
    })

    const CustomTooltip = ({ active, payload, type}) => {
        if (!active || !payload || !payload.length) return null

        const d = payload[0].payload

        return (
            <div style={{
                background: palette.navy,
                color: "#fff",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13,
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
            </div>
        )
    }

    const SectionCard = ({title, subtitle, icon: Icon, children}) => {
        return (
            <div
                style={{
                background: palette.card,
                borderRadius: 16,
                border: `1px solid ${palette.grid}`,
                padding: "20px 20px",
                boxShadow: "0 1px 2px rgba(23,40,75,0.06)",
                width: '50%'
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <Icon size={18} color={palette.navy} />
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: palette.navy }}>{title}</h3>
                </div>
                <p style={{ margin: "0 0 16px 30px", fontSize: 12.5, color: palette.muted }}>{subtitle}</p>
                {children}
            </div>
        )
    }

    const palette = {
  navy: "#17284B",
  gold: "#C9A227",
  teal: "#2F7C74",
  bg: "#F6F5F1",
  card: "#FFFFFF",
  muted: "#6B7280",
  grid: "#E7E4DC",
};

const rankFill = (index, base) => {
  if (index === 0) return palette.gold;
  if (index === 1) return "#B8B4A8";
  if (index === 2) return "#C08A5B";
  return base;
};

    const RankedBarChart = ({ data, type, barColor, height }) => {
        return (
            <ResponsiveContainer width="100%" height={height || Math.max(220, data.length * 56)}>
                <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 4 }}>
                    <CartesianGrid horizontal={false} stroke={palette.grid} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: palette.muted }} axisLine={false} tickLine={false} />
                    <YAxis
                    type="category"
                    dataKey="name"
                    width={140}
                    tick={{ fontSize: 13, fill: palette.navy, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip type={type} />} cursor={{ fill: "rgba(23,40,75,0.04)" }} />
                    <Bar dataKey="total_spent" radius={[0, 8, 8, 0]} barSize={22}>
                        {data.map((_, i) => (
                            <Cell key={i} fill={rankFill(i, barColor)} />
                        ))}
                        <LabelList
                        dataKey="total_spent"
                        position="right"
                        formatter={(v) => (type === "spending" ? `$${v.toLocaleString("es-ES")}` : v)}
                        style={{ fill: palette.navy, fontWeight: 700, fontSize: 12 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        )
    }
  
    return (
       <SectionCard title="Top clientes por gasto" subtitle="Ranking por total invertido en la tienda" icon={Trophy}>
            <RankedBarChart data={chartData} type="spending" barColor={palette.navy} />
       </SectionCard>
    )

}
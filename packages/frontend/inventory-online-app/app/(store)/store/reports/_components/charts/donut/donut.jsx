export default function DonutChart({methods, totalUsd}) {
    const palette = {
        navy: "#17284B",
        gold: "#C9A227",
        teal: "#2F7C74",
        bg:   "#F6F5F1",
        card: "#FFFFFF",
        muted: "#6B7280",
        grid: "#E7E4DC",
    }   
    const DonutChart = ({methods, totalUsd}) => {
        const size = 210
        const cx = size / 2
        const cy = size / 2
        const r = 92   
        const ri = 56

        if (!totalUsd) {
            return <div style={{ padding: 24, textAlign: "center", fontSize: 13, color: palette.muted }}>Sin datos en el periodo</div>
        }

        let cumAngle = -Math.PI / 2

        const slices = methods.map((m) => {
            const pct = m.usd / totalUsd
            const angle = pct * 2 * Math.PI
            const a0 = cumAngle
            cumAngle += angle
            
            const a1 = cumAngle
            const x1 = cx + r * Math.cos(a0)
            const y1 = cy + r * Math.sin(a0)
            const x2 = cx + ri * Math.cos(a0)
            const y2 = cy + ri * Math.sin(a0)
            const x3 = cx + r * Math.cos(a1)
            const y3 = cy + r * Math.sin(a1)
            const x4 = cx + ri * Math.cos(a1)
            const y4 = cy + ri * Math.sin(a1)
            const large = angle > Math.PI ? 1 : 0
            
            const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x3} ${y3} L ${x4} ${y4} A ${ri} ${ri} 0 ${large} 0 ${x2} ${y2} Z`
            return { ...m, d, pct }
        })

        const single = methods.length === 1

        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                <svg width={size} height={size} role="img" aria-label="Distribución de ingresos por método de pago">
                    { single ? (
                        <circle
                            cx={cx}
                            cy={cy}
                            r={(r + ri) / 2}
                            fill="none"
                            stroke={methods[0].color}
                            strokeWidth={r - ri}
                        />
                    )
                    : (
                        slices.map((s) => (
                            <path key={s.name} d={s.d} fill={s.color} stroke={palette.card} strokeWidth={2.5} />
                        ))
                    )}
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, width: "100%" }}>
                    {methods.map((m) => (
                        <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}>
                            <span style={{ width: 11, height: 11, borderRadius: 3, background: m.color, flexShrink: 0 }} />
                            <span style={{ color: palette.muted, flex: 1 }}>{m.name}</span>
                            <span style={{ fontWeight: 700, color: palette.navy, fontVariantNumeric: "tabular-nums" }}>
                                {m.pctUsd}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <DonutChart methods={methods} totalUsd={totalUsd} />
    )
}
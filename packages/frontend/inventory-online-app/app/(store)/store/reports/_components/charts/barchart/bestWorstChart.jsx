import React from 'react'

export default function BesWorstChart({bestDays, worstDays}) {

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

    const BestWorstList = ({ best, worst }) => {
        const rows = [...best, ...worst]
        const maxValue = Math.max(...rows.map((r) => r.value))
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {rows.map((r, i) => {
                    const pct = Math.max(4, Math.round((r.value / maxValue) * 100))
                    const barColor = r.kind === "best" ? "#639922" : "#E24B4A"
                    const trackColor = r.kind === "best" ? "#EAF3DE" : "#FCEBEB"
                    return (
                        <React.Fragment key={`${r.kind}-${r.name}`}>
                             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ width: 64, fontSize: 12, color: palette.muted, flexShrink: 0 }}>{r.name}</span>
                                <div style={{ flex: 1, background: trackColor, borderRadius: 6, height: 16 }}>
                                    <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 6 }} />
                                </div>
                                <span
                                    style={{
                                    width: 70,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    textAlign: "right",
                                    color: palette.navy,
                                    flexShrink: 0,
                                    }}
                                >
                                    ${r.value.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                                </span>
                             </div>
                            {i === best.length - 1 && (
                                <div style={{ textAlign: "center", fontSize: 11, color: palette.muted, padding: "2px 0" }}>···</div>
                            )}
                        </React.Fragment>
                    )
                })}
            
            </div>
        )
    }

    return (
        <BestWorstList best={bestDays} worst={worstDays}/>
    )
}
export default function SplitListChart({currencies = []}) {
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
    const CURRENCY_COLORS = { "Bolivar Digital": "#2a78d6", Dolares: "#1baf7a" }
    const CurrencySplit = ({currencies}) => { 
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", height: 26, borderRadius: 8, overflow: "hidden", background: palette.grid }}>
                    {currencies.map((c) => (
                        <div
                            key={c.name}
                            style={{
                                width: `${c.pct}%`,
                                background: CURRENCY_COLORS[c.name] || "#888",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#fff",
                            }}
                        >
                            {c.pct >= 12 ? `${c.pct}%` : ""}
                        </div>
                    ))}
                </div>
                {currencies.map((c) => (
                    <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}>
                        <span style={{ width: 11, height: 11, borderRadius: 3, background: CURRENCY_COLORS[c.name] || "#888", flexShrink: 0 }} />
                        <span style={{ color: palette.muted, flex: 1 }}>{c.name}</span>
                        <span style={{ color: palette.muted, fontSize: 12 }}>{c.txn.toLocaleString()} txn</span>
                        <span style={{ fontWeight: 700, color: palette.navy, fontVariantNumeric: "tabular-nums", minWidth: 90, textAlign: "right" }}>
                            ${c.usd.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>
        )
    }

    return <CurrencySplit currencies={currencies} />
}
export default function MethodsComparativeTable({ methods = [], totalUsd = [] }) {
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

    const MethodTable = ({methods, totalUsd}) => {
        return (
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, tableLayout: "fixed" }}>
                    <thead>
                        <tr style={{ borderBottom: `1px solid ${palette.grid}` }}>
                            {["Método", "Moneda", "Transacciones", "Total USD", "% del total"].map((h) => (
                                <th key={h} style={{ textAlign: h === "Método" ? "left" : "right", padding: "8px 6px", 
                                color: palette.muted, fontWeight: 600 }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {methods.map((m) => (
                            <tr key={m.name} style={{ borderBottom: `1px solid ${palette.grid}` }}>
                                <td style={{ padding: "9px 6px", display: "flex", alignItems: "center", gap: 7 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: 2, background: m.color, flexShrink: 0, display: "inline-block" }} />
                                    <span style={{ color: palette.navy, fontWeight: 500 }}>{m.name}</span>
                                </td>
                                <td style={{ padding: "9px 6px", textAlign: "right", color: palette.muted }}>{m.currency}</td>
                                <td style={{ padding: "9px 6px", textAlign: "right", color: palette.navy, fontVariantNumeric: "tabular-nums" }}>{m.txn.toLocaleString()}</td>
                                <td style={{ padding: "9px 6px", textAlign: "right", color: palette.navy, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                                     ${m.usd.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                                </td>
                                <td style={{ padding: "9px 6px", textAlign: "right", color: palette.muted }}>
                                    {m.pctUsd}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return <MethodTable methods={methods} totalUsd={totalUsd} />
}
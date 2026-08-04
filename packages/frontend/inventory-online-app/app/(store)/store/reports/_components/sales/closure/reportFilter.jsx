'use client'

export default function ReportFilters({date, onDateChange, sellerId, onSellerChange, sellers}) {
    return (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <input
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                style={{
                border: `1px solid ${palette.grid}`,
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                color: palette.navy,
                background: palette.card,
                }}
            />
            <select
                value={sellerId ?? ""}
                onChange={(e) => onSellerChange(e.target.value || null)}
                style={{
                border: `1px solid ${palette.grid}`,
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                color: palette.navy,
                background: palette.card,
                minWidth: 180,
                }}
            >
                <option value="">Todos los vendedores</option>
                {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                    {s.name}
                </option>
                ))}
            </select>
        </div>
    )
}
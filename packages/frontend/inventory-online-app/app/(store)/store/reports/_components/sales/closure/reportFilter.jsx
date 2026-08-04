'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

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

export default function ReportFilters({date, sellerId, sellers = []}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [seller, setSeller] = useState(sellerId)

    const onDateChange = (value) => {
        const date = value
        const params = new URLSearchParams(searchParams)
        params.set('date', date)
        router.replace(`?${params.toString()}`)
    }

    const onSellerChange = (value) => {
        const user_id = value
        const params = new URLSearchParams(searchParams)
        setSeller(user_id)
        params.set('userId', user_id)
        router.replace(`?${params.toString()}`)
    }


    return (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <input
                type="date"
                value={date ?? ""}
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
                value={seller ?? ""}
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
                {sellers.length > 0 && sellers.map((s) => (
                <option key={s.id} value={s.id}>
                    {s.name}
                </option>
                ))}
            </select>
        </div>
    )
}
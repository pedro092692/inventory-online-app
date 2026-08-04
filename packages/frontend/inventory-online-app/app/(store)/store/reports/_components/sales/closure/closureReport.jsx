'use client'

import { useState } from 'react'
import { ReceiptText, Wallet, AlertTriangle } from "lucide-react"


export default function ClosureReport({totalBs = 0, totalUsd = 0, netBs = 0, netUsd = 0}) {
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
    const [subTab, setSubTab] = useState("cierre")
    const subTabs = [
        { id: "cierre", label: "Cierre de caja" },
        { id: "efectivo", label: "Efectivo en caja" },
    ]

    const SubTabs = ({options, value, onChange}) => {
        return (
            <div
                style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 16,
                    borderBottom: `1px solid ${palette.grid}`,
                    paddingBottom: 10,
                }}
            >   
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onChange(opt.id)}
                        style={{
                            border: "none",
                            background: value === opt.id ? "#EAF0FF" : "transparent",
                            color: value === opt.id ? palette.navy : palette.muted,
                            fontWeight: value === opt.id ? 700 : 500,
                            fontSize: 13,
                            padding: "6px 12px",
                            borderRadius: 8,
                            cursor: "pointer",
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        )
    }

    const KpiCard = ({icon: Icon, label, value}) => {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <div
                        style={{
                            background: palette.card,
                            borderRadius: 14,
                            padding: "18px 20px",
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            boxShadow: "0 1px 2px rgba(23,40,75,0.06)",
                            border: `1px solid ${palette.grid}`,
                            flex: 1,
                            minWidth: 160,
                        }}
                    >
                <div
                    style={{
                        background: palette.navy,
                        color: "#fff",
                        borderRadius: 10,
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Icon size={18} />
                </div>
                <div style={{ fontSize: 12, color: palette.muted, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: palette.navy, fontVariantNumeric: "tabular-nums" }}>
                    {value}
                </div>
                    </div>
                </div>
            </div>
        )
    }

    const money = (n, currencySymbol = "") => {
        const value = Number(n) || 0
        const formatted = Math.abs(value).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        const sign = value < 0 ? "−" : ""
        return `${sign}${currencySymbol}${formatted}`;
    }

    const CashClosingView = () => {
        return (
            <>
                <KpiCard icon={ReceiptText} label="Vendido en bolívares" value={money(totalBs, "Bs ")} />
                <KpiCard icon={ReceiptText} label="Vendido en dólares" value={money(totalUsd, "$")} />
            </>
        )
    }

    const CashBalanceView = () => {
        return (
            <>
                <KpiCard icon={Wallet} label="Neto en bolívares" value={money(netBs, "Bs ")} />
                <KpiCard icon={Wallet} label="Neto en dólares" value={money(netUsd, "$")} />
            </>
        )
    }

    return (
        <>
            <SubTabs options={subTabs} value={subTab} onChange={setSubTab} />
            {subTab === "cierre" && <CashClosingView />}
            {subTab === "efectivo" && <CashBalanceView />}
        </>
    )
}
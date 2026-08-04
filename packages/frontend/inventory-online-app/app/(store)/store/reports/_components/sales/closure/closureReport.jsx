'use client'
import {Container} from '@/app/ui/utils/container'
import { useState } from 'react'
import { ReceiptText, Wallet, AlertTriangle } from "lucide-react"
import ChartSection from '@/app/(store)/store/reports/_components/charts/sectionChart'


export default function ClosureReport({totalBs = 0, totalUsd = 0, netBs = 0, netUsd = 0, closing_rows = [], balance_rows = []}) {
    const palette = {
        navy: "#1B4279",
        primary: "#12113B",
        gold: "#C9A227",
        teal: "#2F7C74",
        bg: "#F6F5F1",
        card: "#FFFFFF",
        muted: "#6B7280",
        grid: "#E7E4DC",
        warningBg: "#FDF3E3",
        warningText: "#8A5A11",
        danger: "#B3261E",
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
                    width: "100%",
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
                            fontSize: "16px",
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
                <div>
                    <div style={{ fontSize: 12, color: palette.muted, fontWeight: 500 }}>{label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: palette.navy, fontVariantNumeric: "tabular-nums" }}>
                        {value}
                    </div>
                </div>
            </div>
        )
    }

    const PaymentMethodRow = ({ color, name, subtitle, value, highlight }) => {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: highlight ? palette.warningBg : "transparent",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 500, color: highlight ? palette.warningText : palette.navy }}>
                            {name}
                        </div>
                    </div>
                    {subtitle && (
                        <div style={{ fontSize: 14, color: highlight ? palette.warningText : palette.muted }}>{subtitle}</div>
                    )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: highlight ? palette.warningText : palette.navy }}>
                    {value}
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
            <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <KpiCard icon={ReceiptText} label="Vendido en bolívares" value={money(totalBs, "Bs ")} />
                    <KpiCard icon={ReceiptText} label="Vendido en dólares" value={money(totalUsd, "$")} />
                </div>

                <ChartSection title="Cierre de caja" subtitle="Total vendido por método de pago — no incluye vueltos" icon={ReceiptText}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {closing_rows.length === 0 && <p style={{ color: palette.muted, fontSize: 13 }}>Sin ventas para este filtro.</p>}
                        {closing_rows.map((r) => (
                            <PaymentMethodRow 
                                key={r.name}
                                color={r.color}
                                name={r.name}
                                subtitle={`${r.transactions} transacciones`}
                                value={money(r.amount, r.isUsd ? "$" : "Bs ")}
                            />
                        ))}
                    </div>
                </ChartSection>
            </div>
        )
    }

    const CashBalanceView = () => {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%"  }}>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <KpiCard icon={Wallet} label="Neto en bolívares" value={money(netBs, "Bs ")} />
                    <KpiCard icon={Wallet} label="Neto en dólares" value={money(netUsd, "$")} />
                </div>

                <ChartSection title="Efectivo en caja" subtitle="Neto real por canal, incluyendo vueltos" icon={Wallet}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {balance_rows.length === 0 && <p style={{ color: palette.muted, fontSize: 13 }}>Sin ventas para este filtro.</p>}
                        {balance_rows.map((r) => (
                            <PaymentMethodRow 
                                key={r.name}
                                color={r.color}
                                name={r.name}
                                subtitle={r.onlyRefunds ? "Solo vueltos, sin ventas" : `Ventas: ${money(r.sales, r.isUsd ? "$" : "Bs ")}`}
                                value={money(r.net, r.isUsd ? "$" : "Bs ")}
                                highlight={r.onlyRefunds}
                            />
                        ))}
                    </div>
                </ChartSection>
                <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: palette.muted, margin: 0 }}>
                    <AlertTriangle size={16} />
                    Este número debería coincidir con el conteo físico al cerrar caja.
                </p>
            </div>
        )
    }

    return (
        <Container
            padding={'0px'}
            gap={'16x'}
            direction={'column'}
            width={'100%'}
            alignItem={'flex-start'}
        >
            <SubTabs options={subTabs} value={subTab} onChange={setSubTab} />
            {subTab === "cierre" && <CashClosingView />}
            {subTab === "efectivo" && <CashBalanceView />}
        </Container>
    )
}
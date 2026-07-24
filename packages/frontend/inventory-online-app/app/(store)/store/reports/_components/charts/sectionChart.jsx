
export default function ChartSection({ title, subtitle, icon: Icon, children }) {
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

    return (
        <div
            style={{
            background: palette.card,
            borderRadius: 16,
            border: `1px solid ${palette.grid}`,
            padding: "20px 24px",
            boxShadow: "0 1px 2px rgba(23,40,75,0.06)",
            width: '100%'
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <Icon size={18} color={'#1B4279'} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1B4279' }}>{title}</h3>
            </div>
            <p style={{ margin: "0 0 16px 30px", fontSize: 12.5, color: 'grey' }}>{subtitle}</p>
            {children}
        </div>
    )
}
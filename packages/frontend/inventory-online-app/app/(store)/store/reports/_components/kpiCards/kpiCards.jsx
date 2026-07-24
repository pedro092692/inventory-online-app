export default function KpiCard({label, value, icon: Icon}) {
    return (
        <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-200">
            <div className="bg-slate-800 text-white rounded-xl w-10 h-10 flex items-center justify-center shrink-0">
                <Icon size={18} />
            </div>
            <div>
                <div className="text-xs text-gray-500 font-medium">{label}</div>
                <div className="text-2xl font-bold text-slate-800 tabular-nums">{value}</div>
            </div>
        </div>
    )
}
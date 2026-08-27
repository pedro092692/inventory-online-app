export default function KpiCard({label, value, icon: Icon, text='xs',
        extraText=false, 
        textColor='default', 
        mainTextSize='2xl'}) {
    const COLORS = {
        "default": "text-slate-800",
        "green-700": "text-green-700",
        "green-600": "text-green-600",
        "red-600": "text-red-600",
        "red-700": "text-red-700",
        "gray-500": "text-gray-500",
    }

    return (
        <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-200 h-full">
            <div className="bg-slate-800 text-white rounded-xl w-10 h-10 flex items-center justify-center shrink-0">
                <Icon size={18} />
            </div>
            <div>
                <div className={`text-${text} text-gray-500 font-medium`}>{label}</div>
                <div className={`text-${mainTextSize} font-bold ${COLORS[textColor]} tabular-nums`}>{value}</div>
                {
                    extraText && <p className="text-xs text-gray-500 font-medium">{extraText}</p>
                }
            </div>
        </div>
    )
}


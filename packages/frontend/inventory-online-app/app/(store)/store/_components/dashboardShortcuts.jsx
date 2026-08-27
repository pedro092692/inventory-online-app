import Link from 'next/link'
import { PackagePlus, Receipt, StickyNotePlus } from 'lucide-react'
import { Container } from '@/app/ui/utils/container'

const SHORTCUTS = [
    { label: 'Agregar producto', href: '/store/products/add', icon: PackagePlus },
    { label: 'Ver facturas', href: '/store/bills', icon: Receipt },
    { label: 'Vender', href: '/store/sell', icon: StickyNotePlus},
]

function ShortcutCard({ label, href, icon: Icon }) {
    return (
        <Link
            href={href}
            className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-200 hover:border-slate-400 hover:shadow-md transition-all"
        >
            <div className="bg-slate-800 text-white rounded-xl w-10 h-10 flex items-center justify-center shrink-0">
                <Icon size={18} />
            </div>
            <span className="text-sm font-semibold text-slate-800">{label}</span>
        </Link>
    )
}

export default function DashboardShortcuts() {
    return (
        <Container padding={'0px'} width={'100%'} justifyContent={'flex-start'} gap={'20px'}>
            {SHORTCUTS.map((shortcut) => (
                <ShortcutCard key={shortcut.href} {...shortcut} />
            ))}
        </Container>
    )
}

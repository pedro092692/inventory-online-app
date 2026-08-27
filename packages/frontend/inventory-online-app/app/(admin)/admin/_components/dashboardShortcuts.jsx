import Link from 'next/link'
import { PlusCircle, Store, Inbox } from 'lucide-react'
import { Container } from '@/app/ui/utils/container'

// No per-role filtering needed here (unlike the /store dashboard's shortcuts): every
// user who reaches /admin is already role 1 (admin) — enforced by the checkAdmin
// middleware — so these are visible to whoever is looking at this page.
const SHORTCUTS = [
    { label: 'Agregar tienda nueva', href: '/admin/users/add', icon: PlusCircle },
    { label: 'Ver todas las tiendas', href: '/admin/users', icon: Store },
    { label: 'Ver pagos pendientes', href: '/admin/payments?status=pending', icon: Inbox },
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

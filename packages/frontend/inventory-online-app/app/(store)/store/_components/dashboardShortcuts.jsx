import Link from 'next/link'
import { PackagePlus, Receipt } from 'lucide-react'
import { Container } from '@/app/ui/utils/container'
import { getCurrentUser } from '@/app/utils/getCurrentUser'

// `role` follows the same convention as ui/dashboard/panel/panel.jsx's menu items:
// 1=admin, 2=storeOwner, 3=manager, 4=user/vendedor. "Agregar producto" excludes 4 —
// vendedores can sell but not touch the catalog (mirrors the ProductRoutes POST '/'
// authorization(PERMISSIONS.UPDATE) guard on the backend, so this isn't just a UI hide).
const SHORTCUTS = [
    { label: 'Agregar producto', href: '/store/products/add', icon: PackagePlus, role: [1, 2, 3] },
    { label: 'Ver facturas', href: '/store/bills', icon: Receipt, role: [1, 2, 3, 4] },
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

export default async function DashboardShortcuts() {
    const userInfo = await getCurrentUser()
    const visibleShortcuts = SHORTCUTS.filter((shortcut) => shortcut.role.includes(userInfo?.role))

    return (
        <Container padding={'0px'} width={'100%'} justifyContent={'flex-start'} gap={'20px'}>
            {visibleShortcuts.map((shortcut) => (
                <ShortcutCard key={shortcut.href} {...shortcut} />
            ))}
        </Container>
    )
}

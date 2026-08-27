import GetItemAction from '@/app/lib/actions/get'
import Link from 'next/link'
import { PackageX, CircleCheck } from 'lucide-react'

/**
 * "Stock bajo" widget for the store's home dashboard. Lists the products whose stock has
 * fallen to or below their configured min_stock (see ProductService.getLowStockProducts),
 * so the owner/manager can restock before running out — the count is the TOTAL number of
 * low-stock products, the list below shows only the most urgent few.
 */
export default async function LowStockWidget() {
    const response = await GetItemAction('products/low-stock?limit=5', 'Hubo un error inesperado intenta nuevamente')
    const { data, error } = response

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    const count = data?.count ?? 0
    const products = data?.products || []

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 w-full">
            <div className="flex items-center gap-3 mb-3">
                <div className={`rounded-xl w-10 h-10 flex items-center justify-center shrink-0 text-white ${count > 0 ? 'bg-red-600' : 'bg-slate-800'}`}>
                    {count > 0 ? <PackageX size={18} /> : <CircleCheck size={18} />}
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-medium">Alertas de stock bajo</div>
                    <div className={`text-2xl font-bold tabular-nums ${count > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                        {count} producto{count === 1 ? '' : 's'}
                    </div>
                </div>
            </div>

            {count === 0 && (
                <p className="text-sm text-gray-500">Todos los productos tienen stock por encima de su mínimo.</p>
            )}

            {products.length > 0 && (
                <ul className="divide-y divide-gray-100">
                    {products.map((product) => (
                        <li key={product.id}>
                            <Link
                                href={`/store/products/edit/${product.id}`}
                                className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-md px-1 -mx-1"
                            >
                                <span className="text-sm text-slate-800 font-medium truncate pr-2">{product.name}</span>
                                <span className="text-sm text-red-600 font-semibold tabular-nums whitespace-nowrap">
                                    {product.stock} / {product.min_stock}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {count > products.length && (
                <Link href="/store/products" className="text-xs text-slate-500 underline mt-2 inline-block">
                    Ver los {count - products.length} restantes en Productos
                </Link>
            )}
        </div>
    )
}

'use client'
import ProductSelector from "@/app/(store)/store/sell/_components/product/productSelector"
import Cart from "@/app/(store)/store/sell/_components/cart/cart"
import styles from './sell.module.css'
import { useState, useMemo } from 'react'

export default function Sell() {
    const [activeScreen, setActiveSreen] = useState('products')
    const [items, setItems] = useState([])

    const total = useMemo(() => {
        const result = items.reduce((acc, item) => {
            const bs = item.quantity * parseFloat(item.reference_selling_price)
            const usd = item.quantity * parseFloat(item.selling_price)

            return {
                total_bs: acc.total_bs + bs,
                total_usd: acc.total_usd + usd
            }
        }, {total_bs: 0, total_usd: 0})

        return {
            total_bs: new Intl.NumberFormat('es-Ve').format(result.total_bs.toFixed(2)),
            total_usd: new Intl.NumberFormat('es-Ve').format(result.total_usd.toFixed(2))
        }
    }, [items])

    
    return (
        <div className={styles.mainContainer}>
            {/* products */}
            <div className={`${styles.searchContainer} ${activeScreen !== 'products' ? styles.hide : ''}`}>
                <ProductSelector  setItems={setItems} items={items}/>
                <button onClick={() => setActiveSreen('customer')} disabled={items.length === 0}>Seleccionar cliente

                </button>
            </div>

            {/* customer */}
            <div className={`${styles.searchContainer} ${activeScreen !== 'customer' ? styles.hide : ''}`}>
                <button onClick={() => setActiveSreen('products')}>Agregar productos</button>
            </div>


            {/* cart */}
            <div className={styles.cartContainer}>
                 <Cart items={items} setItems={setItems} total={total}/>
            </div>
            
        </div>
    )
}
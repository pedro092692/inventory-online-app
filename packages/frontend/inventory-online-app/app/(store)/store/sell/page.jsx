'use client'
import ProductSelector from "@/app/(store)/store/sell/_components/product/productSelector"
import Cart from "@/app/(store)/store/sell/_components/cart/cart"
import styles from './sell.module.css'
import SelectCustomer from "@/app/(store)/store/sell/_components/customer/customer"
import { useState, useMemo } from 'react'

export default function Sell() {
    const [activeScreen, setActiveScreen] = useState('products')
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
                <button onClick={() => setActiveScreen('customer')} disabled={items.length === 0}>Seleccionar cliente

                </button>
            </div>

            {/* customer */}
            <div className={`${styles.searchContainer} ${activeScreen !== 'customer' ? styles.hide : ''}`}>
                <SelectCustomer />
                <button onClick={() => setActiveScreen('products')}>Agregar productos</button>
                <button onClick={() => setActiveScreen('pay')}>Pagar</button>
            </div>

            {/* pay */}
            <div className={`${styles.searchContainer} ${activeScreen !== 'pay' ? styles.hide : ''}`}>
                pagar factura
                <button onClick={() => setActiveScreen('products')}>Agregar productos</button>
                <button onClick={() => setActiveScreen('customer')}>Seleccionar cliente</button>
                <button onClick={() => setActiveScreen('pay')}>Pagar</button>
            </div>


            {/* cart */}
            <div className={styles.cartContainer}>
                 <Cart items={items} setItems={setItems} total={total}/>
            </div>
            
        </div>
    )
}
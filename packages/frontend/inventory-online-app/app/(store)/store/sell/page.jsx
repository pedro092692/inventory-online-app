'use client'
import ProductSelector from "@/app/(store)/store/sell/_components/product/productSelector"
import Cart from "@/app/(store)/store/sell/_components/cart/cart"
import { Container } from "@/app/ui/utils/container"
import styles from './sell.module.css'
import { useState } from 'react'

export default function Sell() {
    const [show, setShow] = useState(false)
    const [items, setItems] = useState([])
    console.log(items)

    return (
        <div className={styles.mainContainer}>
            <div className={styles.searchContainer}>
                <ProductSelector  setItems={setItems} />
            </div>

            <div className={styles.cartContainer}>
                 <Cart items={items} setItems={setItems}/>
            </div>
        </div>
    )
}
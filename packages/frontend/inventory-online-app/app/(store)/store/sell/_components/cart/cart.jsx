'use client'
import { Container} from '@/app/ui/utils/container'
import styles from './cart.module.css'
import { Button } from '@/app/ui/utils/button/buttons'
import { useState } from 'react'



export default function Cart({items=[], setItems, total = 0}) {

    const handleRemoveItem = (id) => {
        setItems(prev => [...prev.filter(item => item.id !== id)])
    }

    const handleQuantityChange = (id, rawValue) => {
        setItems(prev =>
            prev.map(item => {
                if (item.id !== id ) return item

                if (rawValue === "") {
                    return {...item, quantity: ""}
                }

                const quantity = parseInt(rawValue)

                if (isNaN(quantity)) {
                    return item
                }

                const safeQuantity = Math.max(1, Math.min(quantity, item.stock))

                return {...item, quantity: safeQuantity}
            })
        )
    }
    
    return (
        <Container className={`${styles.cartContainer} shadow`}>
            <Container className={styles.cartHeader}>
                <div className={styles.headerNAME}>
                    <p className={'p3-b'}>
                        NOMBRE
                    </p>
                </div>
                    <div className={styles.headerPRICE}>
                    <p className={'p3-b'}>
                        PRECIO UNITARIO Bs
                    </p>
                </div>
                <div className={styles.headerQUANTITY}>
                    <p className={'p3-b'}>
                        CANTIDAD
                    </p>
                </div>
                <div className={styles.headerTOTAL}>
                    <p className={'p3-b'}>
                        TOTAL
                    </p>
                </div>
            </Container>
            <Container className={styles.cartContent}>
                {items.map((item, index) => {
                    return (
                        <Container key={index} className={styles.cartRow}>
                            <div className={styles.itemNameContainer}>
                                <p className={`${styles.itemName} p2-r`}>
                                   {`${item.name.length > 76 ? item.name.slice(0, 76) + '...' : item.name}`}
                                </p>
                                <Button 
                                    icon={'trash'} 
                                    children={''} 
                                    showIcon={true} 
                                    type='danger' 
                                    size={[12, 12]} 
                                    style={{padding: '8px'}}
                                    onClick={() => handleRemoveItem(item.id)}
                                />
                            </div>
                            
                            <div className={styles.itemPriceContainer}>
                                <p className={'p2-r'}>
                                    {new Intl.NumberFormat('es-Ve').format(item.reference_selling_price)}
                                </p>
                            </div>
                            
                            <div className={styles.itemQuantityContainer}>
                                {/* <p className={'p2-r'}>
                                    {item.quantity}
                                </p> */}
                                <input type="number" value={item.quantity} min="1" max={item.stock} 
                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                    
                                />
                            </div>
                            
                            <div className={styles.itemTotalContainer}>
                                <p className={'p2-r'}>
                                    {new Intl.NumberFormat('es-Ve').format(
                                        isNaN(item.quantity) ? 0 :
                                        item.quantity * item.reference_selling_price
                                    )}
                                </p>
                            </div>
                        </Container>
                        
                    )
                })}
                
                {items.length > 0 && (
                    <Container
                        className={styles.totalContainer}
                    >
                        <p className={'p2-r'}>Total $: <span className={'p2-b'}>{total?.total_usd || 0}</span></p>
                        <p className={'p2-r'}>Total Bs: <span className={'p2-b'}>{total?.total_bs || 0}</span></p>
                    </Container>
                )}
                {items.length < 1 && <p className={'p2-r'} style={{padding: '16px'}}>No hay productos agregados...</p>}
            </Container>
        </Container>
    )
}
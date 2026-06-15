'use client'
import { Container} from '@/app/ui/utils/container'
import styles from './cart.module.css'
import { Button } from '@/app/ui/utils/button/buttons'
import { useState } from 'react'



export default function Cart({items=[], setItems}) {

    const handleRemoveItem = (id) => {
        setItems(prev => [...prev.filter(item => item.id !== id)])
    }

    const handleQuantityChange = (id, quantity) => {
        console.log(id, quantity)
        setItems(prev => [...prev.map(item => {
            if(item.id === id) {
                if(quantity > item.stock) {
                    item.quantity = item.stock
                    return item
                }

                if(quantity < 1 || isNaN(quantity)) {
                    item.quantity = 1
                    return item
                }

                item.quantity = quantity
                return item
                
            }

            return item
        })])
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
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                    
                                />
                            </div>
                            
                            <div className={styles.itemTotalContainer}>
                                <p className={'p2-r'}>
                                    {new Intl.NumberFormat('es-Ve').format(item.quantity * item.reference_selling_price)}
                                </p>
                            </div>
                        </Container>
                        
                    )
                })}

                {items.length < 1 && <p className={'p2-r'} style={{padding: '16px'}}>No hay productos agregados...</p>}
            </Container>
        </Container>
    )
}
'use client'
import { Container} from '@/app/ui/utils/container'
import styles from './cart.module.css'
import { Button } from '@/app/ui/utils/button/buttons'


export default function Cart({items=[], setItems, total=0, state={}}) {

    const handleRemoveItem = (id) => {
        if(state?.message) return 
        setItems(prev => [...prev.filter(item => item.id !== id)])
    }

    const handleQuantityChange = (id, rawValue) => {
        if(state?.message) return
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
                <Container className={styles.cartItems}>
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
                                    type={state?.message ? 'disabled' : 'danger'} 
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
                                <input type='number' 
                                    className={styles.inputQuantity}
                                    value={item.quantity} 
                                    min='1' 
                                    max={item.stock} 
                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                    onKeyDown={
                                        (e) => {
                                            if (e.key === 'Enter'){
                                                e.preventDefault();
                                            }
                                        }
                                    }
                                    disabled={state?.message ? true : false}
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
                
                    {items.length < 1 && <p className={'p2-r'} style={{padding: '16px'}}>No hay productos agregados...</p>}
                </Container>
            </Container>
            <Container
                className={styles.totalContainer}
            >
                <p className={'p1-b'}>Total $: <span className={'p1-r'}>
                    { new Intl.NumberFormat('en-US').format(total?.total_usd.toFixed(2) || 0)}
                    </span>
                </p>
                <p className={'p1-b'}>Total Bs: <span className={'p1-r'}>
                    { new Intl.NumberFormat('es-VE').format(total?.total_bs.toFixed(2) || 0)}
                    </span>
                </p>
            </Container>
        </Container>
    )
}
'use client'
import { Container} from '@/app/ui/utils/container'
import styles from './cart.module.css'
import { Button } from '@/app/ui/utils/button/buttons'


export default function Cart({items=[]}) {
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
                {/* {Array.from({length: 20}).map((item, index) => {
                    return (
                        <Container key={index} className={styles.cartRow}>
                            <div className={styles.itemNameContainer}>
                                <p className={`${styles.itemName} p2-r`}>
                                    acido acetilsalicilico 81mg x 10 tab caja x 10 blister drotafarma
                                </p>
                                <Button 
                                    icon={'trash'} 
                                    children={''} 
                                    showIcon={true} 
                                    type='danger' 
                                    size={[12, 12]} 
                                    style={{padding: '8px'}}
                                />
                            </div>
                            
                            <div className={styles.itemPriceContainer}>
                                <p className={'p2-r'}>1.020,00</p>
                            </div>
                            
                            <div className={styles.itemQuantityContainer}>
                                <p className={'p2-r'}>1</p>
                            </div>
                            
                            <div className={styles.itemTotalContainer}>
                                <p className={'p2-r'}>1.020,00</p>
                            </div>
                        </Container>
                        
                    )
                })} */}

                {items.length < 1 && <p className={'p2-r'} style={{padding: '16px'}}>No hay productos agregados...</p>}
            </Container>
        </Container>
    )
}
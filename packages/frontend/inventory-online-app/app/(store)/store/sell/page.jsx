'use client'
import ProductSelector from "@/app/(store)/store/sell/_components/product/productSelector"
import { Container } from "@/app/ui/utils/container"
import styles from './sell.module.css'
import { useState } from 'react'

export default function Sell() {
    const [show, setShow] = useState(false)

    const handleGoCustomer = () => {
        setShow(!show)
    }

    return (
        <Container
            className={styles.mainContainer}
        >
            <Container
                    className={`${styles.container} ${!show ? styles.show : styles.hide}`}
            >
                    <Container
                        className={styles.searchContainer}
                    >
                        <ProductSelector />
                        <button
                            onClick={handleGoCustomer}
                        >
                            Seleccionar cliente
                        </button>

                    </Container>
                    <Container
                        className={styles.cartContainer}
                    >
                        <p>Products in the cart</p>
                        <p>Manage cart</p>
                    </Container>

            </Container>

            <Container
                    className={`${styles.container} ${show ? styles.show : styles.hide}`}
            >
                    <Container
                        className={styles.customerContainer}
                    >
                        <p>Selecciona a un cliente</p>
                        <button
                            onClick={handleGoCustomer}
                        >
                            Volver
                        </button>
                    </Container>

            </Container>    
        </Container>
    )
}
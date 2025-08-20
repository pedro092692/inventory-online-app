import styles from './page.module.css'
import { Button } from '../navbar/button'
import { Navbar } from '../navbar/navbar.jsx'
import Image from 'next/image'

export function Hero() {
    return (
        <>
            <Navbar />
            <div className={styles.hero}>
                <div className={styles.info}>
                    <h1>Mucho mas que un inventario.</h1>
                    <p>Nexastock es el software de administración para tu negocio en la nube que tiene las herramientas necesarias para tener el control total de tu inventario clientes y mas.</p>
                </div>
                <div className={styles.callToAction}>
                    <button className={styles.button}>
                        Empezar Ahora
                    </button>
                    <Button text={'Demostración'}/>
                </div>
                <Image 
                    src="/images/home/placeholder.png"
                    width={1354}
                    height={741}
                    loading="lazy"
                    alt="nexa software"
                />
            </div>
        </>
    )
}
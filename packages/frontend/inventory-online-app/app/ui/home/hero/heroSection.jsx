import styles from './page.module.css'
import { Navbar } from '../navbar/navbar.jsx'
import Image from 'next/image'
import { Container } from '../../utils/container.jsx'
import { Button } from '../../utils/button/buttons'

export function Hero() {
    return (
        <>
            <Navbar />
            {/* <div className={styles.hero}>
                <div className={styles.info}>
                    <h1 className='h1'>El software que te ayuda a vender más, sin complicaciones.</h1>
                    <p className='p1-r'>
                        Nexastock es el software en la nube que te ayuda a administrar tu negocio de 
                        forma sencilla. Gestiona tu inventario, 
                        conoce tus productos más vendidos, envía órdenes de compra por WhatsApp y mucho más.
                    </p>
                </div>
                <div className={styles.callToAction}>
                    <Button 
                        text='Empezar ahora'
                        type='primary'
                    />
                    <Button 
                        text='Solicitar demo'
                        type='outline'
                    />
                </div>
                <Image 
                    src="/images/home/img-1.png"
                    loading="lazy"
                    width={1080}
                    height={714}
                    alt="nexa software"
                />
            </div> */}
            <Container children={'soy un container'}/>

        </>
    )
}
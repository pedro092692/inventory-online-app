import { Button } from '../../utils/button/buttons'
import { Container } from '../../utils/container'
import Image from 'next/image'
import styles from './page.module.css'

export function CallToAction() {
    return (
        <section className='container' style={{flexDirection: 'column', justifyContent:'start', gap:'24px'}}>
            <h2 className={`h1 ${styles.mainText}`}>
                Lleva tu negocio al siguiente nivel con Nexastock.
            </h2>

            {/* complement text */}
            <Container
                className={styles.textContainer}
                padding='0px'
                justifyContent='center'
            >
                <p className='p1-r'>Comienza a organizar tu inventario, vende más y ahorra tiempo en la gestión de tu empresa.</p>
                <Button type='secondary' icon='playArrow' showIcon={true} size={[20, 20]}>
                    Empieza hoy
                </Button>
            </Container>
            <Container
                className={styles.imageContainer}

            >
                <Image 
                    src="/images/home/nexastock_sofware.png" alt="nexastock software" 
                    fill={true}
                    style={{objectFit: 'contain'}}
                />
            </Container>
        </section> 
    )
}
import styles from './page.module.css'
import Image from 'next/image'
import { Container } from '../../utils/container.jsx'
import { Button } from '../../utils/button/buttons'

export function Hero() {
    return (
        <section className={styles.hero}>
            <Container
                className={styles.mainContainer}
                gap='24px'
                direction='column'
                flexGrow='1'
            >
                {/* text content */}
                <Container
                    className={styles.textContainer}
                    gap='24px'
                    direction='column'
                    justifyContent='center'
                >   
                    <h1 className='h1 text-center'>
                        El software que te ayuda a vender más, sin complicaciones.
                    </h1>
                    <p className={`${styles.text} p1-r text-justify`}>
                        Nexastock es el software en la nube que te ayuda a <span className='p1-b'>administrar tu negocio</span> de forma 
                        sencilla. Gestiona tu inventario, conoce tus productos más vendidos, <span className='p1-b'>envía 
                        órdenes de compra por WhatsApp</span> y mucho más.
                    </p>

                    {/* call to action buttons */}
                    <Container
                        gap='16px'
                        padding='0'
                    >
                        <Button 
                            children='Empezar ahora'
                            type='primary'
                        />
                        <Button 
                            children='Solicitar demo'
                            type='outline'
                        />
                    </Container>
                </Container>
                {/* hero image */}
                <Container
                    className={styles.imageContainer}
                >
                    <Image 
                    src='/images/home/img-1.png'
                    fill
                    style={{ objectFit: 'cotain' }}
                    alt='Nexastock Software'
                    />
                </Container>
                
            </Container>
        </section>
    )
}
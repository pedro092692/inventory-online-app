import styles from './page.module.css'
import Image from 'next/image'
import { Container } from '../../utils/container.jsx'
import { Button } from '../../utils/button/buttons'

export function Hero() {
    return (
        <section className={styles.hero}>
            <Container
                gap='24px'
                direction='column'
                padding='40px 40px 0px 40px'
                flexGrow='1'
                justifyContent='start'
            >
                {/* text content */}
                <Container
                    gap='24px'
                    direction='column'
                    padding='0'
                    width='788px'
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
                <Image 
                    src='/images/home/img-1.png'
                    width={1080}
                    height={714}
                    alt='Nexastock Software'
                />
            </Container>
        </section>
    )
}
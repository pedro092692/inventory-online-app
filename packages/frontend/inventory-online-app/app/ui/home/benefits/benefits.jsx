import { Container } from '../../utils/container'
import Image from 'next/image'
import styles from './page.module.css'


export function Benefits() {
    // list of benefits 
    const benefits = ['Gestión de inventario en tiempo real.',
                      'Productos más vendidos y análisis de clientes.',
                      'Órdenes de compra por WhatsApp en un clic.',
                      'Múltiples métodos de pago: Dólares y Bolívares.',
                      'Reportes inteligentes para tomar mejores decisiones.'
                    ]

    console.log(styles.listItem)
    return(
        <section className={`container ${styles.section}`}>
            {/* text */}
            <Container 
                direction='column'
                padding='0px'
                gap='8px'
                justifyContent='start'
                >
                <h2 className={`h1 ${styles.textFill} ${styles.text}`}>Todo lo que necesitas en un solo lugar.</h2>
                <p className={`p1-r ${styles.textFill}`}>Con Nexastock, llevar el control de tu <span className='p1-b'>negocio</span> nunca había sido tan fácil.</p>
            </Container>
            {/* image and list */}
            <Container
                className={styles.imageListContainer}
            >
                
                {/* image */}
                <Container
                    className={styles.imageContainer}
                >
                    <Image 
                        src={'/images/home/invoice_1.png'}
                        fill
                        style={{objectFit: 'contain'}}
                        alt='nexastock xample invoice image'
                        loading='lazy'
                    />
                </Container>
                

                {/* list */}
                <Container
                    direction='column'
                    padding='24px 0px'
                    justifyContent='space-between'
                    alignItem='start'
                    height='100%'
                    
                >
                    {/* render list of benefits */}
                    {benefits.map((item, index) => {
                        return (
                            <Container 
                                className={`${styles.listItem} shadow`}
                                padding='16px'
                                backgroundColor='var(--color-neutralGrey100)'
                                gap='16px'
                                key={index}
                                width='100%'
                                
                            > 
                                {
                                    index % 2 == 0 ? <><img src={`/images/home/list-icons/${index}.png`} alt="icon" /> <p className='p1-r'>{item}</p></> :
                                    <>
                                    <p className={`p1-r ${styles.textList}`}>{item}</p>
                                    <img src={`/images/home/list-icons/${index}.png`} alt="icon" />
                                    </>
                                }
                                
                                
                                
                            </Container>
                        )
                    })}

                </Container>
            </Container>
        </section>
    ) 
}
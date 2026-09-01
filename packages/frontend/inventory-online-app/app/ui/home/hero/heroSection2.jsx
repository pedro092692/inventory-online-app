import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { WHATSAPP_URL } from '../whatsappLink'

const benefits = [
    { title: '100% en la nube', text: 'Entras desde la tienda, la casa o el teléfono.' },
    { title: 'Órdenes por WhatsApp', text: 'El cliente arma su pedido y te llega listo.' },
    { title: 'Dólares y bolívares', text: 'Varios métodos de pago en la misma venta.' },
    { title: 'Reportes al instante', text: 'Qué se vende, quién compra, cuánto queda.' },
]

export function HeroTwo() {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroGrid}>
                <div className={styles.heroTextCol}>
                    <div className={styles.badge}>Para tiendas, minimarkets y ventas por WhatsApp</div>

                    <h1 className={styles.headline}>
                        Deja de adivinar<br />qué tienes y qué<br />se está vendiendo.
                    </h1>

                    <p className={styles.subtext}>
                        <span className={'p1-b'}>Nexastock</span> lleva tu inventario, tus ventas y tus <span className={'p1-b'}>pedidos de WhatsApp</span> en un solo lugar. Desde la nube, en cualquier equipo.
                    </p>

                    <div className={styles.ctaRow}>
                        {/* <Link href='/#precio'>
                            <span className={styles.primaryCta}>Ver precio — 20$/mes</span>
                        </Link> */}
                        <a href={WHATSAPP_URL} target='_blank' rel='noopener noreferrer' className={styles.primaryCta}>
                            Quiero registrame
                        </a>
                    </div>

                    <div className={styles.disclaimerRow}>
                        <span>Sin instalación</span><span className={styles.dot}>·</span>
                        <span>Sin contrato</span><span className={styles.dot}>·</span>
                        <span>Cancelas cuando quieras</span>
                    </div>
                </div>

                <div className={styles.heroImageFrame}>
                    {/* <Image
                        src='/images/home/hero_img_2.png'
                        fill
                        style={{objectFit: 'contain'}}
                        alt='Panel de reportes de Nexastock'
                        priority
                    /> */}
                </div>
            </div>

            <div id='beneficios' className={styles.benefitsStrip}>
                {benefits.map((item, index) => (
                    <div className={styles.benefitItem} key={index}>
                        <div className={styles.benefitTitle}>{item.title}</div>
                        <div className={styles.benefitText}>{item.text}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}

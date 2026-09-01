import styles from './page.module.css'
import { WHATSAPP_URL } from '../whatsappLink'

const features = [
    'Inventario y punto de venta sin límite de productos',
    'Órdenes de compra por WhatsApp',
    'Pagos en dólares y bolívares',
    'Reportes y análisis de clientes',
    'Acceso desde cualquier dispositivo',
    'Soporte directo por WhatsApp',
]

// Venta en frío por ahora (sin autoregistro ni pago en línea): se muestra el
// precio para dar transparencia, pero el CTA lleva a WhatsApp en vez de un
// checkout de autoservicio.
export function Pricing() {
    return (
        <section id='precio' className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Un solo plan. Todo incluido.</h2>
                <p className={styles.subtitle}>Sin niveles, sin límites artificiales, sin sorpresas en la factura.</p>
            </div>

            <div className={styles.card}>
                <div className={styles.priceRow}>
                    <span className={styles.price}>20$</span>
                    <span className={styles.pricePeriod}>/ mes</span>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.featureList}>
                    {features.map((feature, index) => (
                        <div key={index}>{feature}</div>
                    ))}
                </div>

                <a href={WHATSAPP_URL} target='_blank' rel='noopener noreferrer' className={styles.cta}>
                    Hablar por WhatsApp
                </a>

                <div className={styles.footnote}>Te activamos la cuenta por WhatsApp. Cancelas cuando quieras.</div>
            </div>
        </section>
    )
}

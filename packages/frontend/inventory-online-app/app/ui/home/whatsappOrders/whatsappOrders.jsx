import Image from 'next/image'
import styles from './page.module.css'

export function WhatsappOrders() {
    return (
        <section className={styles.section}>
            <div className={styles.imageFrame}>
                <Image
                    src='/images/home/invoice_1.png'
                    fill
                    style={{objectFit: 'contain'}}
                    alt='Orden de compra enviada por WhatsApp en Nexastock'
                />
            </div>

            <div className={styles.textCol}>
                <h2 className={styles.title}>El pedido llega armado, no en 20 mensajes.</h2>
                <p className={styles.text}>Elige productos y cantidades, y la orden te llega con el total calculado. Tú confirmas y sale del inventario.</p>

                <div className={styles.bullets}>
                    <div className={styles.bulletItem}><span className={styles.dash}>—</span>Total y existencia calculados al momento</div>
                    <div className={styles.bulletItem}><span className={styles.dash}>—</span>Historial por cliente, sin buscar en el chat</div>
                    <div className={styles.bulletItem}><span className={styles.dash}>—</span>Descarga el comprobante o lo reenvías</div>
                </div>
            </div>
        </section>
    )
}

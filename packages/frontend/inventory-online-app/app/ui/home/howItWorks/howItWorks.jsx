import styles from './page.module.css'

const steps = [
    {
        n: '01',
        title: 'Carga tus productos',
        text: 'Súbelos desde tu lista o cárgalos uno a uno. Costo, existencia y precio de venta.',
    },
    {
        n: '02',
        title: 'Vende y registra',
        text: 'Punto de venta, pedidos por WhatsApp y pagos en dólares o bolívares.',
    },
    {
        n: '03',
        title: 'Revisa y decide',
        text: 'Reportes de cierre, productos más vendidos y mejores clientes.',
    },
]

export function HowItWorks() {
    return (
        <section id='como-funciona' className={styles.section}>
            <div className={styles.header}>
                <div className={styles.eyebrow}>Cómo funciona</div>
                <h2 className={styles.title}>Operando en tres pasos.</h2>
            </div>

            <div className={styles.grid}>
                {steps.map((step) => (
                    <div className={styles.card} key={step.n}>
                        <div className={styles.number}>{step.n}</div>
                        <div className={styles.cardTitle}>{step.title}</div>
                        <div className={styles.cardText}>{step.text}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}

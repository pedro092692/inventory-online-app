'use client'
import { useRef } from 'react'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { Icon } from '@/app/ui/utils/icons/icons'
import styles from './quote.module.css'

// Same html2pdf.js approach as bills/_components/pdf/pdf.jsx: render a hidden HTML
// template and rasterize it client-side — no backend endpoint needed.
export default function QuotePdf({ items = [], total = { total_usd: 0, total_bs: 0 }, customerName = '' }) {
    const componentRef = useRef(null)
    const now = new Date()

    const handleDownload = async () => {
        const html2pdf = (await import('html2pdf.js')).default
        const element = componentRef.current

        const options = {
            margin: 10,
            filename: `presupuesto_${now.getTime()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().set(options).from(element).save()
    }

    return (
        <>
            <Button type='grey' style={{backgroundColor: 'var(--color-accentRed400)', padding: '8px'}}
                title={'Descargar presupuesto'}
                onClick={handleDownload}
                disabled={items.length < 1}
            >
                <Icon icon='pdf' size={[24, 24]}></Icon>
            </Button>
            <div style={{display: 'none'}}>
                <div className={styles.pdfContainer} ref={componentRef}>
                    <Container padding={'0px'} direction={'row'} gap={'16px'} justifyContent={'space-between'}>
                        <header className={styles.header}>
                            <h2>Presupuesto / Cotización</h2>
                            <p className='p2-r'>Fecha: {now.toLocaleDateString('es-VE')} — {now.toLocaleTimeString('es-VE', {timeZone: 'America/Caracas', hour: '2-digit', minute: '2-digit', hour12: true})}</p>
                        </header>
                        {customerName &&
                            <section className={styles.header}>
                                <h2>Cliente</h2>
                                <p className='p2-r'>{customerName}</p>
                            </section>
                        }
                    </Container>

                    <section>
                        <h2>Productos</h2>
                        {items.length > 0 ? (
                            <>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Precio Unitario</th>
                                            <th>Cantidad</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, i) => (
                                            <tr key={i}>
                                                <td>{item.name}</td>
                                                <td data-label="unit_price">{new Intl.NumberFormat('es-VE', {style: 'currency', currency: 'VES'}).format(item.reference_selling_price || 0)}</td>
                                                <td data-label="quantity">{item.quantity}</td>
                                                <td data-label="total">{new Intl.NumberFormat('es-VE', {style: 'currency', currency: 'VES'}).format((item.quantity || 0) * (item.reference_selling_price || 0))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className={styles.totalBlock}>
                                    <p><strong>Total Bs:</strong> <span className='p2-b'>{new Intl.NumberFormat('es-VE').format(total.total_bs.toFixed(2))}</span></p>
                                    <p><strong>Total $:</strong> <span className='p2-b'>{new Intl.NumberFormat('en-US').format(total.total_usd.toFixed(2))}</span></p>
                                </div>
                            </>
                        ) : (
                            <p>No hay productos agregados</p>
                        )}
                    </section>

                    <p className={styles.disclaimer}>
                        Este presupuesto es informativo, no constituye una factura ni reserva de stock.
                        Precios sujetos a disponibilidad y variación de la tasa de cambio del día.
                    </p>
                </div>
            </div>
        </>
    )
}

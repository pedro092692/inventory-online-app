'use client'
import { useRef } from 'react'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { Icon } from '@/app/ui/utils/icons/icons'
import styles from './pdf.module.css'
import { formatDate } from '@/app/(store)/store/bills/_components/detail/basicInfo/basicInfo'

export default function InvoicePDF({invoice=null}) {
    const componentRef = useRef(null)
    const {
        id,
        date,
        total,
        total_reference,
        total_paid,
        status,
        customer,
        seller,
        products,
    } = invoice
    const payments = invoice['payments-details'] || []
    const handleInvoicePDF = async () => {
        const html2pdf = (await import('html2pdf.js')).default

        const element = componentRef.current
        console.log(element)

        const options = {
            margin: 10,
            filename: `factura_${id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().set(options).from(element).save()
    }

    return (
        <>
            <Button type='grey' style={{backgroundColor: 'var(--color-accentRed400)', padding: '8px'}}
                title={'Descargar factura'}
                onClick={handleInvoicePDF}
            >
                <Icon icon='pdf' size={[24, 24]}></Icon>
            </Button>
            <div style={{display: 'none'}}>
                <div className={styles.pdfContainer} ref={componentRef}>
                    <Container
                        padding={'0px'}
                        direction={'row'}
                        gap={'16px'}
                        justifyContent={'space-between'}
                    >
                        <header className={styles.header}>
                            <h2>Factura / Recibo</h2>
                            <p className='p2-r'>N° Recibo: {id}</p>
                            <p className='p2-r'>Fecha: {formatDate(date)} — {formatDate(date, true)}</p>
                            <p className='p2-r'>Vendedor: {seller?.name || 'Vendedor'}</p>
                        </header>
                        
                        <section className={styles.header}>
                            <h2>Detalle del cliente</h2>
                            <p className='p2-r'><strong>Nombre:</strong> {customer?.name || 'Cliente Desconocido'}</p>
                            <p className='p2-r'><strong>Cédula:</strong> {customer?.id_number || '0'}</p>
                            <p className='p2-r'><strong>Teléfono:</strong> {customer?.phone || 'XXX-XXXXXXX'}</p>
                        </section>

                        
                    </Container>
                   

                    <section className={styles.section}>
                        <h3>Estatus de orden</h3>
                        <p><strong>Estatus:</strong> {status === 'paid' ? 'Pagada' : 'Pendiente'}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>Detalles de productos</h2>
                        {products &&
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
                                {products.map((p, i) => (
                                <tr key={i}>
                                    <td>{p?.products?.name || 'Producto'}</td>
                                    <td data-label="unit_price">{ new Intl.NumberFormat('es-VE', {style: 'currency', currency: 'VES'}).format(p?.unit_price) || '0'}</td>
                                    <td data-label="quantity">{p?.quantity || '0'}</td>
                                    <td data-label="total">{ new Intl.NumberFormat('es-VE', {style: 'currency', currency: 'VES'}).format(p.quantity * p.unit_price) || '0'}</td>
                                </tr>
                                ))} 
                            </tbody>
                            </table>
                                <div className={styles.totalBlock}>
                                    <p> <strong>Total Bs:</strong> Bs.S. <span className={'p2-b'}>{total_reference}</span></p>
                                    {/* <p><strong>Total USD:</strong> ${total}</p> */}
                                </div>
                            </>
                        }
                        {!products && <p>No hay detalles de productos</p>}
                    </section>

                    <section className={styles.section}>
                        <h2>Detalles de pago</h2>
                        <div className={styles.separator}></div>
                        {payments.length > 0 ? payments.map((pay, i) => (
                        <div key={i} className={styles.paymentBlock}>
                            <p><strong>Método:</strong> {pay?.payments?.name || 'Pago'}</p>
                            <p><strong>Moneda:</strong> {pay?.payments?.currency || 'VES'}</p>
                            <p><strong>Monto:</strong> {pay.amount}</p>
                            <p><strong>Referencia:</strong> 
                                {new Intl.NumberFormat('es-US', {style: 'currency', currency: 'USD'}).format(pay.reference_amount)}
                            </p>
                            <div className={styles.separator}></div>
                        </div>
                        ))
                        :
                        <p>No hay detalles de pago</p>
                        }
                    </section>
                </div>
            </div>
        </>
    )
 }
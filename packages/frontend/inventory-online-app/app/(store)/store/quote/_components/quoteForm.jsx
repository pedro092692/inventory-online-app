'use client'
import { useState, useMemo } from 'react'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { Input } from '@/app/ui/form/input/input'
import ProductSelector from '@/app/(store)/store/sell/_components/product/productSelector'
import Cart from '@/app/(store)/store/sell/_components/cart/cart'
import SelectCustomer from '@/app/(store)/store/sell/_components/customer/customer'
import QuotePdf from '@/app/(store)/store/quote/_components/quotePdf'
import styles from './quote.module.css'

// Ephemeral price quote: pick products, optionally attach a customer (existing or
// typed by hand), then send the total by WhatsApp or download it as a PDF. Nothing
// here touches stock or creates a sale — it's purely informational, so it doesn't
// need a backend endpoint at all (same building blocks as the "Vender" screen).
export default function QuoteForm({ exchangeRate = null }) {
    const [items, setItems] = useState([])
    const [customer, setCustomer] = useState(null)
    const [useManualCustomer, setUseManualCustomer] = useState(false)
    const [manualName, setManualName] = useState('')
    const [manualPhone, setManualPhone] = useState('')

    const total = useMemo(() => {
        return items.reduce((acc, item) => {
            const quantity = parseInt(item.quantity) || 0
            const bs = quantity * parseFloat(item.reference_selling_price || 0)
            const usd = quantity * parseFloat(item.selling_price || 0)
            return {
                total_bs: acc.total_bs + bs,
                total_usd: acc.total_usd + usd,
            }
        }, { total_bs: 0, total_usd: 0 })
    }, [items])

    const customerName = useManualCustomer ? manualName : customer?.name
    const customerPhone = useManualCustomer ? manualPhone : customer?.phone

    const switchToManual = () => {
        setCustomer(null)
        setUseManualCustomer(true)
    }

    const switchToExisting = () => {
        setManualName('')
        setManualPhone('')
        setUseManualCustomer(false)
    }

    const buildWhatsappMessage = () => {
        const now = new Date()
        const date = now.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' })

        const productLines = items
            .map((item, i) => `${i + 1}. ${item.name} (${item.quantity}) x ${new Intl.NumberFormat('es-VE').format(item.reference_selling_price || 0)} Bs`)
            .join('\n')

        return `PRESUPUESTO
${customerName ? `Cliente: ${customerName.toUpperCase()}\n` : ''}Fecha: ${date}
━━━━━━━━━━━━━━━━━━━━━━
PRODUCTOS
${productLines}
━━━━━━━━━━━━━━━━━━━━━━
TOTAL: ${new Intl.NumberFormat('es-VE').format(total.total_bs.toFixed(2))} Bs (${new Intl.NumberFormat('en-US').format(total.total_usd.toFixed(2))} $)
━━━━━━━━━━━━━━━━━━━━━━
Presupuesto informativo, sujeto a disponibilidad y a la variación de la tasa del día.`
    }

    const handleSendWhatsapp = () => {
        if (!customerPhone || items.length < 1) return

        const message = buildWhatsappMessage()
        const phoneDigits = customerPhone.replace(/[^\d]/g, '')
        const link = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`
        window.open(link, '_blank')
    }

    return (
        <Container direction='column' padding='0px' width='100%' alignItem='start' gap='16px'>
            <ProductSelector setItems={setItems} items={items} />

            {/* customer (optional): search an existing one, or type a name/phone for someone who isn't a customer yet */}
            <Container direction='column' padding='0px' alignItem='start' gap='4px' className={styles.section}>
                <h3 className='p2-b'>Cliente (opcional)</h3>
                {!useManualCustomer ? (
                    <>
                        <SelectCustomer customer={customer} setCustomer={setCustomer} bgColor='white' />
                        <button type='button' className={styles.toggleLink} onClick={switchToManual}>
                            ¿No es cliente? Escribir nombre y teléfono
                        </button>
                    </>
                ) : (
                    <>
                        <Input
                            type='text'
                            placeHolder='Nombre'
                            icon='person'
                            required={false}
                            value={manualName}
                            onChange={(e) => setManualName(e.target.value)}
                        />
                        <Input
                            type='phone'
                            placeHolder='Teléfono'
                            icon='phone'
                            required={false}
                            value={manualPhone}
                            onChange={(e) => setManualPhone(e.target.value)}
                        />
                        <button type='button' className={styles.toggleLink} onClick={switchToExisting}>
                            Buscar cliente existente
                        </button>
                    </>
                )}
            </Container>

            <Cart items={items} setItems={setItems} total={total} state={{}} totalPaidUSD={0} />

            <Container direction='row' padding='0px' gap='12px' className={styles.actions}>
                <Button
                    type='secondary'
                    showIcon={true}
                    icon='whatsapp'
                    size={[20, 20]}
                    title={!customerPhone ? 'Escribe o selecciona un teléfono para enviar' : 'Enviar por WhatsApp'}
                    disabled={items.length < 1 || !customerPhone}
                    onClick={handleSendWhatsapp}
                >
                    Enviar por WhatsApp
                </Button>

                <QuotePdf items={items} total={total} customerName={customerName} />
            </Container>
        </Container>
    )
}

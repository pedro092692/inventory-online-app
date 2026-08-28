'use client'
import { useState, useMemo } from 'react'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import ProductSelector from '@/app/(store)/store/sell/_components/product/productSelector'
import styles from './labels.module.css'

const escapeHtml = (str) => String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

// Select products and print price tags directly from the browser. Prices are read
// live from each product's USD price and whatever exchange rate is currently set in
// "Divisa" (see reference_selling_price from the products search) — bump that rate
// as a buffer against daily devaluation and every label reflects it automatically,
// no separate "label rate" needed.
export default function LabelsForm() {
    const [items, setItems] = useState([])

    const removeItem = (id) => setItems(prev => prev.filter(item => item.id !== id))

    const updateQuantity = (id, rawValue) => {
        if (rawValue === '') {
            setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: '' } : item))
            return
        }
        const quantity = parseInt(rawValue)
        if (isNaN(quantity)) return
        setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    }

    // one printable label per requested copy — "quantity" here means "how many tags
    // of this product", same field ProductSelector already increments when the same
    // product is picked again
    const labels = useMemo(() => {
        return items.flatMap(item => {
            const copies = parseInt(item.quantity) || 1
            return Array.from({ length: copies }).map((_, i) => ({
                key: `${item.id}-${i}`,
                name: item.name,
                priceBs: parseFloat(item.reference_selling_price || 0),
                priceUsd: parseFloat(item.selling_price || 0)
            }))
        })
    }, [items])

    const handlePrint = () => {
        if (labels.length < 1) return

        const printWindow = window.open('', '_blank', 'width=900,height=700')
        if (!printWindow) return // popup blocked by the browser

        const labelsHtml = labels.map(label => `
            <div class="label">
                <p class="name">${escapeHtml(label.name)}</p>
                <p class="priceBs">${new Intl.NumberFormat('es-VE').format(label.priceBs)} Bs</p>
            </div>
        `).join('')

        // Self-contained document — printed on its own, so it never drags in the
        // app's sidebar/header. Tune grid-template-columns / label padding here to
        // match your actual label sheet.
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>Etiquetas de precio</title>
                <style>
                    * { box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; margin: 0; padding: 8mm; }
                    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
                    .label { border: 1px solid #000; border-radius: 4px; padding: 6mm 4mm; text-align: center; page-break-inside: avoid; text-transform: capitalize; }
                    .name { font-size: 12px; font-weight: 600; margin: 0 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;text-transform: capitalize;}
                    .priceBs { font-size: 18px; font-weight: 800; margin: 0; }
                    .priceUsd { font-size: 11px; color: #555; margin: 2px 0 0; }
                    @page { margin: 8mm; }
                </style>
            </head>
            <body>
                <div class="grid">${labelsHtml}</div>
                <script>
                    window.onload = function () { window.print() }
                    window.onafterprint = function () { window.close() }
                </script>
            </body>
            </html>
        `)
        printWindow.document.close()
    }

    return (
        <Container direction='column' padding='0px' width='100%' alignItem='start' gap='16px'>
            <ProductSelector setItems={setItems} items={items} />

            {items.length > 0 &&
                <div className={styles.list}>
                    {items.map(item => (
                        <div key={item.id} className={styles.row}>
                            <p className={`p2-r ${styles.rowName}`}>{item.name}</p>
                            <p className='p2-r'>{new Intl.NumberFormat('es-VE').format(item.reference_selling_price || 0)} Bs</p>
                            <div className={styles.rowQuantity}>
                                <input
                                    type='number'
                                    min='1'
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                                />
                            </div>
                            <Button
                                icon='trash'
                                children=''
                                showIcon={true}
                                type='danger'
                                size={[12, 12]}
                                style={{ padding: '8px' }}
                                onClick={() => removeItem(item.id)}
                            />
                        </div>
                    ))}
                </div>
            }

            <Button
                type='secondary'
                showIcon={true}
                icon='pdf'
                size={[20, 20]}
                title={'Imprimir etiquetas'}
                disabled={labels.length < 1}
                onClick={handlePrint}
            >
                {`Imprimir etiquetas (${labels.length})`}
            </Button>

            {labels.length > 0 &&
                <div className={styles.labelsGrid}>
                    {labels.map(label => (
                        <div key={label.key} className={styles.label}>
                            <p className={styles.labelName} style={{textTransform: 'capitalize'}}>{label.name}</p>
                            <p className={styles.labelPriceBs}>{new Intl.NumberFormat('es-VE').format(label.priceBs)} Bs</p>
                            {/* <p className={styles.labelPriceUsd}>{new Intl.NumberFormat('en-US').format(label.priceUsd)} $</p> */}
                        </div>
                    ))}
                </div>
            }
        </Container>
    )
}

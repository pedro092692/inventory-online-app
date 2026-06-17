'use client'
import ProductSelector from "@/app/(store)/store/sell/_components/product/productSelector"
import Cart from "@/app/(store)/store/sell/_components/cart/cart"
import styles from './sell.module.css'
import SelectCustomer from "@/app/(store)/store/sell/_components/customer/customer"
import SelectObject from '@/app/utils/selectObject'
import Select from '@/app/ui/select/select'
import CreateInvoiceAction from "@/app/lib/actions/createInvoice"
import { useState, useMemo, useActionState, useEffect } from 'react'

export default function SellForm({paymentMethods=[]}) {
    const [activeScreen, setActiveScreen] = useState('products')
    const [items, setItems] = useState([])
    const [customer, setCustomer] = useState(null)
    const paymentOptions = SelectObject(paymentMethods, 'id', 'name')
    const initialState = {message: null, errors: {}}
    const createInvoice = CreateInvoiceAction.bind(null, 'Factura creada con éxito')
    const [state, formAction, isPending] = useActionState(createInvoice, initialState)
    
    const handlePay = (formData) => {
        const amount = formData.get('amount')
        if (!amount) return 
        
        formData.append('details', JSON.stringify(items.map(item => {
            return {
                product_id: item.id,
                quantity: item.quantity
            }
        })))
        
        return formAction(formData)
    }
    
    const total = useMemo(() => {
        const result = items.reduce((acc, item) => {
            const bs = item.quantity * parseFloat(item.reference_selling_price)
            const usd = item.quantity * parseFloat(item.selling_price)

            return {
                total_bs: acc.total_bs + bs,
                total_usd: acc.total_usd + usd
            }
        }, {total_bs: 0, total_usd: 0})

        return {
            total_bs: new Intl.NumberFormat('es-Ve').format(result.total_bs.toFixed(2)),
            total_usd: new Intl.NumberFormat('es-Ve').format(result.total_usd.toFixed(2))
        }
    }, [items])

    useEffect(() => {
        const success = state?.message
        if (success) {
            setItems([])
            setActiveScreen('products')
            setCustomer(null)
        }
    }, [state])
    
    return (
        <div className={styles.mainContainer}>
            <form className={styles.mainContainer} action={handlePay}>
                {/* products */}
                <div className={`${styles.searchContainer} ${activeScreen !== 'products' ? styles.hide : ''}`}>
                    <ProductSelector  setItems={setItems} items={items}/>
                    <button type="button" onClick={() => setActiveScreen('customer')} disabled={items.length === 0}>Seleccionar cliente

                    </button>
                </div>

                {/* customer */}
                <div className={`${styles.searchContainer} ${activeScreen !== 'customer' ? styles.hide : ''}`}>
                    <SelectCustomer customer={customer} setCustomer={setCustomer} />
                    <button type="button" onClick={() => {setActiveScreen('products')}}>Agregar productos</button>
                    <button type="button" onClick={() => {setActiveScreen('pay')}}>Pagar</button>
                </div>

                {/* pay */}
                <div className={`${styles.searchContainer} ${activeScreen !== 'pay' ? styles.hide : ''}`}>
                    <Select name='payment_method_id' options={paymentOptions} selectKey={1} defaultValue={'Punto de venta'}/>
                    <input type="number" name="amount" placeholder="Monto" min="1" step="0.1" required></input>
                    <button type="button" onClick={() => {setActiveScreen('products')}}>Agregar productos</button>
                    <button type="button" onClick={() => {setActiveScreen('customer')}}>Seleccionar cliente</button>
                    <button type='submit'>Pagar</button>
                    {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}
                </div>

                {/* cart */}
                <div className={styles.cartContainer}>
                    <Cart items={items} setItems={setItems} total={total}/>
                </div>
            </form>
        </div>
    )
}
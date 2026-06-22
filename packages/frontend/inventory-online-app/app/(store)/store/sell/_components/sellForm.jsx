'use client'
import ProductSelector from "@/app/(store)/store/sell/_components/product/productSelector"
import Cart from "@/app/(store)/store/sell/_components/cart/cart"
import styles from './sell.module.css'
import SelectCustomer from "@/app/(store)/store/sell/_components/customer/customer"
import SelectObject from '@/app/utils/selectObject'
import Select from '@/app/ui/select/select'
import CreateInvoiceAction from "@/app/lib/actions/createInvoice"
import { useState, useMemo, useActionState, useEffect } from 'react'

export default function SellForm({ paymentMethods=[], exchangeRate=null }) {
    const [activeScreen, setActiveScreen] = useState('products')
    const [items, setItems] = useState([])
    const [customer, setCustomer] = useState(null)
    const [payments, setPayments] = useState([])
    const [resetKey, setResetKey] = useState(0)
    const [isPaid, setIsPay] = useState(false)
    const paymentOptions = SelectObject(paymentMethods, 'id', 'name')
    const initialState = {message: null, errors: {}}
    
    const createInvoice = CreateInvoiceAction.bind(null, 'Factura creada con éxito', false, null)
    const [state, formAction, isPending] = useActionState(createInvoice, initialState)
        
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
            total_bs: result.total_bs,
            total_usd: result.total_usd
        }
    }, [items])

    let totalPaid = useMemo(() => {
        const result = payments.reduce((acc, item) => {
            const paymentMethod = paymentMethods.find(pm => pm.id === parseInt(item.payment_method_id))
            
            if (!paymentMethod) return acc
            
            const total = paymentMethod.currency != 'Bolivar Digital' && paymentMethod.currency != 'Undefined' ?
                parseFloat(item.amount) : parseFloat(item.amount) / parseFloat(exchangeRate)

            return acc + total
        }, 0)
        return result
    }, [payments])

    
    const handlePay = (formData) => {
        // set amount and payment_method_id
        const amount = formData.get('amount')
        const payment_method_id = formData.get('payment_method_id')
        
        // add amount and payment_method_id to payments array.
        const newPayments = [
            ...payments,
            {
                payment_method_id: payment_method_id,
                amount: amount,
                name: paymentMethods.find(pm => pm.id === parseInt(payment_method_id)).name || 'Undefined',
                currency: paymentMethods.find(pm => pm.id === parseInt(payment_method_id)).currency || 'Undefined',
            }
        ]
        
        setPayments(newPayments)

        // add details to form data.
        formData.append('details', JSON.stringify(items.map(item => {
            return {
                product_id: item.id,
                quantity: item.quantity
            }
        })))

        // add payments details to form data.
        formData.append('payments', JSON.stringify(newPayments))
        
        
        
        const newTotalPaid = newPayments.reduce((acc, item) => {
            const paymentMethod = paymentMethods.find(
            pm => pm.id === parseInt(item.payment_method_id))

            if (!paymentMethod) return acc

            const total =
                paymentMethod.currency !== 'Bolivar Digital' &&
                paymentMethod.currency !== 'Undefined'
                    ? parseFloat(item.amount)
                    : parseFloat(item.amount) / parseFloat(exchangeRate)
            return acc + total
        }, 0)
        
        if (!isPaid) return

        return formAction(formData)
    }

    const toPaid = (items) => {
        let total = items.reduce((acc, item) => {
            return acc + item.quantity * parseFloat(item.selling_price)
            
        }, 0)
        
        const EPSILON = 0.01

        if (Math.abs(total - totalPaid) < EPSILON) {
            return 0
        }
        return Math.abs(total - totalPaid) 
    }

    const totalBs = (items) => {
        
        const total = items.reduce((acc, item) => {
            return acc + item.quantity * parseFloat(item.reference_selling_price)
        }, 0)
       
        return total
    }

    useEffect(() => {
        const success = state?.message
        if (success) {
            setItems([])
            setActiveScreen('products')
            setCustomer(null)
            setPayments([])
            setResetKey(prev => prev + 1)
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
                    <Select name='payment_method_id' options={paymentOptions} selectKey={1} defaultValue={'Punto de venta'} resetKey={resetKey}/>
                    <input type="number" name="amount" placeholder="Monto" min="0.1" step="0.01" required></input>
                    <button type="button" onClick={() => {setActiveScreen('products')}}>Agregar productos</button>
                    <button type="button" onClick={() => {setActiveScreen('customer')}}>Seleccionar cliente</button>
                    <button type='submit'>Pagar</button>
                    <div>
                        <p>Total Pagado: {totalPaid.toFixed(2)} $ / {toPaid(items) != 0 ? Math.round(totalPaid * exchangeRate * 100) / 100 : totalBs(items)} Bs</p>
                        <p>Resta por pagar: {toPaid(items).toFixed(2)} $ / {Math.round(toPaid(items) * exchangeRate * 100) / 100 } Bs</p>
                    </div>

                    {/* payments */}
                    <div>
                        Pagos:
                        {payments.length > 0 && (
                            payments.map((payment, index) => {
                                return (
                                    <p key={index}>{payment.name} | {payment.amount} | {payment.currency}</p>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* review alter pay */}
                <div>

                </div>

                {/* cart */}
                <div className={styles.cartContainer}>
                    <Cart items={items} setItems={setItems} total={total}/>
                </div>
            </form>
        </div>
    )
}
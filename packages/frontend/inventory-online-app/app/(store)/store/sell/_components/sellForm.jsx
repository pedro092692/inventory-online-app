'use client'
import ProductSelector from '@/app/(store)/store/sell/_components/product/productSelector'
import Cart from '@/app/(store)/store/sell/_components/cart/cart'
import styles from './sell.module.css'
import SelectCustomer from '@/app/(store)/store/sell/_components/customer/customer'
import SelectObject from '@/app/utils/selectObject'
import Select from '@/app/ui/select/select'
import CreateInvoiceAction from '@/app/lib/actions/createInvoice'
import InvoiceActionButtons from '@/app/(store)/store/sell/_components/buttons/buttons'
import InputAddPay from '@/app/(store)/store/sell/_components/payInputButton/payInputButton'
import TotaInfo from '@/app/(store)/store/sell/_components/totalInfo/totalInfo'
import Pyaments from '@/app/(store)/store/sell/_components/payments/payments'
import { useState, useMemo, useActionState, useEffect } from 'react'


export default function SellForm({ paymentMethods=[], exchangeRate=null }) {
    const [activeScreen, setActiveScreen] = useState('products')
    const [items, setItems] = useState([])
    const [customer, setCustomer] = useState(null)
    const [payments, setPayments] = useState([])
    const [resetKey, setResetKey] = useState(0)

    // local state to control actual amount
    const [currentAmount, setCurrentAmount] = useState('')
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('')
    const paymentOptions = SelectObject(paymentMethods, 'id', 'name')

    // form action
    const initialState = {message: null, errors: {}}
    const createInvoice = CreateInvoiceAction.bind(null, 'Factura creada con éxito', false, null)
    const [state, formAction, isPending] = useActionState(createInvoice, initialState)
    
    // total order amount in USD and Bs
    const total = useMemo(() => {
        return items.reduce((acc, item) => {
            const bs = item.quantity * parseFloat(item.reference_selling_price || 0)
            const usd = item.quantity * parseFloat(item.selling_price || 0)
            return {
                total_bs: acc.total_bs + bs,
                total_usd: acc.total_usd + usd,
            }
        }, {total_bs: 0, total_usd: 0})
    }, [items])

    // total paid converted in usd
    const totalPaidUSD = useMemo(() => {
        return payments.reduce((acc, payment) => {
            return acc + payment.amountInUSD
        }, 0)
    }, [payments])

    // remaining to paid
    const remainingToPayUSD = useMemo(() => {
        const remaining = total.total_usd - totalPaidUSD
        return remaining > 0 ? remaining : 0
    }, [total.total_usd, totalPaidUSD])

    // cash change if it the case
    const changeDueUSD = useMemo(() => {
        const change = totalPaidUSD - total.total_usd
        return change > 0 ? change : 0
    }, [total.total_usd, totalPaidUSD])

    // function to add payment method to payment list 
    const handleAddPayment = () => {
        if (!currentAmount || parseFloat(currentAmount) <=0) {
            return alert('Por favor ingresa un monto valido...')
        }

        const methodId = selectedPaymentMethodId || (paymentOptions[0]?.value)
        const paymentMethod = paymentMethods.find(pm => pm.id === parseInt(methodId))

        if (!paymentMethod) return alert('Metodo de pago no seleccionado')
        
        const inputAmount = parseFloat(currentAmount)
        
        const isBolivar = paymentMethod.currency === 'Bolivar Digital'
        
        // The amount entered is converted to USD
        const amountInUSD = Number(
            
            isBolivar
                ? inputAmount / exchangeRate
                : inputAmount
            
        )

        // Rules 1 and 2 validate if it exceeds the remaining amount
        const isCash = paymentMethod.allow_change
        if (!isCash && amountInUSD > (remainingToPayUSD + 0.01)) {
            const maxAllowed = isBolivar ? (remainingToPayUSD * exchangeRate).toFixed(2) + "Bs" : remainingToPayUSD.toFixed(2) + "$"
            return alert(`Los pagos electronicos no pueden exceder el total. Monto maximo permitido en este metodo de pago: ${maxAllowed}`)
        }

        setPayments(prev => [
            ...prev,
            {
                payment_method_id: methodId,
                name: paymentMethod.name,
                currency: paymentMethod.currency,
                amount: inputAmount,
                amountInUSD: amountInUSD
            }
        ])
       
        setCurrentAmount('')
    }

    // function to handle remove mistake payment
    const removePayment = (index) => {
       setPayments(prev => 
            prev.filter((_, i) => i !== index)
        )
    }

    const handleSubmitInvoice = (formData) => {

        if (remainingToPayUSD > 0.01) {
            return alert(`Falta por completar el pago. Restan: ${remainingToPayUSD.toFixed(2)} $`)
        }

        if (items.length < 1) {
            return alert('La factura tiene que tener productos')
        }

        // Customer data and totals are adjusted
        formData.append('customer_id', customer?.id || '')
        formData.append('total_usd', total.total_usd)
        formData.append('total_bs', total.total_bs)
        formData.append('change_usd', changeDueUSD)

        // Product details
        formData.append('details', JSON.stringify(items.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        }))))

        // Payments details
        formData.append('payments', JSON.stringify(payments))

        // send form to formAction
        return formAction(formData)
    }
    
    // reset function
    useEffect(() => {
        if (!state?.message) return
        
        setItems([])
        setActiveScreen('products')
        setCustomer(null)
        setPayments([])
        setCurrentAmount('')
        setResetKey(prev => prev + 1)
        setSelectedPaymentMethodId('')
        
    }, [state])

    // reset screen on delete all items
    useEffect(() => {
        if(items.length < 1) {
            setActiveScreen('products')
        }
    }, [items])

    return (
        <div className={styles.mainContainer}>
            <form className={styles.mainContainer} action={handleSubmitInvoice}>
                {/* products section */}
                <div className={`${styles.searchContainer} ${activeScreen !== 'products' ? styles.hide : ''}`}>
                    <InvoiceActionButtons items={items} 
                        screen={setActiveScreen} 
                        activeScreen={activeScreen}
                        customer={customer}
                    />
            
                    <ProductSelector  setItems={setItems} items={items}/>
                </div>

                {/* customer section */}
                <div className={`${styles.searchContainer} ${activeScreen !== 'customer' ? styles.hide : ''}`}>
                    <InvoiceActionButtons items={items} 
                        screen={setActiveScreen} 
                        activeScreen={activeScreen}
                        customer={customer}
                    />

                    <SelectCustomer customer={customer} setCustomer={setCustomer} showResult={false} bgColor={'white'}/>
                </div>

                {/* pay section */}
                <div className={`${styles.searchContainer} ${activeScreen !== 'pay' ? styles.hide : ''}`}>
                    <InvoiceActionButtons items={items} 
                        screen={setActiveScreen} 
                        activeScreen={activeScreen}
                        customer={customer}
                    />
                    <Select 
                        name='payment_method_id' 
                        options={paymentOptions} 
                        selectKey={1} 
                        defaultValue={'Punto de Venta'} 
                        resetKey={resetKey}
                        onChange={(payment) => setSelectedPaymentMethodId(payment.value)}
                    />
                    
                    <InputAddPay setAmount={setCurrentAmount} 
                                 addPayment={handleAddPayment} 
                                 amount={currentAmount}
                                 remainingToPayUSD={remainingToPayUSD}
                                 isPending={isPending}
                                 />
    
                    <div className={`${styles.dividingLine} shadow`}></div>
                    
                    <TotaInfo 
                        total={total} 
                        totalPaidUSD={totalPaidUSD} 
                        exchangeRate={exchangeRate} 
                        remainingToPayUSD={remainingToPayUSD}
                        changeDueUSD={changeDueUSD}
                    />

                    {/* payments */}
                    <Pyaments payments={payments} removePayment={removePayment}/>

                </div>

                {/* cart section */}
                <div className={styles.cartContainer}>
                    <Cart items={items} setItems={setItems} total={total}/>
                </div>
            </form>
        </div>
    )
}
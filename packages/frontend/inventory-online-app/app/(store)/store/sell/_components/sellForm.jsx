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
import SuccessInfo from '@/app/(store)/store/sell/_components/success/success'
import { Modal } from '@/app/ui/utils/alert/modal'
import { Button } from '@/app/ui/utils/button/buttons'
import { Container } from '@/app/ui/utils/container'
import { useState, useMemo, useActionState, useEffect, startTransition } from 'react'


export default function SellForm({ paymentMethods=[], exchangeRate=null }) {
    const [activeScreen, setActiveScreen] = useState('products')
    const [items, setItems] = useState([])
    const [customer, setCustomer] = useState(null)
    const [payments, setPayments] = useState([])
    const [changes, setChanges] = useState([])
    const [resetKey, setResetKey] = useState(0)
    const [activeChange, setActiveChange] = useState(false)

    // local state to control actual amount
    const [currentAmount, setCurrentAmount] = useState('')
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(1)
    const paymentOptions = SelectObject(paymentMethods, 'id', 'name')
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [resetTime, SetResetTime] = useState(15)

    // form action
    const initialState = {message: null, errors: {}}
    const createInvoice = CreateInvoiceAction.bind(null, 'Factura creada con éxito', false, null)
    const [state, formAction, isPending] = useActionState(createInvoice, initialState)
    
    //modal
    const closeModal = () => {
        setShowModal(false)
        setModalMessage('')
    }

    // load data from localStore at amount component
    useEffect(() => {
        const storedItems = localStorage.getItem('pos_invoice_items')
        const storedCustomer = localStorage.getItem('pos_invoice_customer')
        const storedPayments = localStorage.getItem('pos_invoice_payments')
        const storedChanges = localStorage.getItem('pos_invoice_changes')

        if (storedItems) setItems(JSON.parse(storedItems))
        if (storedCustomer) setCustomer(JSON.parse(storedCustomer))
        if (storedPayments) setPayments(JSON.parse(storedPayments))
        if (storedChanges) setChanges(JSON.parse(storedChanges))
    }, [])

    // save data automatilly in localStorage
    useEffect(() => {
        if (items.length > 0) {
            localStorage.setItem('pos_invoice_items', JSON.stringify(items))
        } else {
            localStorage.removeItem('pos_invoice_items')
        }
    }, [items])

    // save customer data automatilly in localStorage
    useEffect(() => {
        if (customer) {
            localStorage.setItem('pos_invoice_customer', JSON.stringify(customer))
        } else {
            localStorage.removeItem('pos_invoice_customer')
        }
    }, [customer])

    // save payment data automatilly in localStorage
    useEffect(() => {
        if (payments.length > 0) {
            localStorage.setItem('pos_invoice_payments', JSON.stringify(payments))
        } else {
            localStorage.removeItem('pos_invoice_payments')
        }
    }, [payments])

    // sabe changes data automatilly in localStorage
    useEffect(() => {
        if (changes.length > 0) {
            localStorage.setItem('pos_invoice_changes', JSON.stringify(changes))
        } else {
            localStorage.removeItem('pos_invoice_changes')
        }
    }, [changes])

    // aux functon clear localStorage
    const clearInvoiceStorage = () => {
        localStorage.removeItem('pos_invoice_items')
        localStorage.removeItem('pos_invoice_customer')
        localStorage.removeItem('pos_invoice_payments')
        localStorage.removeItem('pos_invoice_changes')
    }

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

    const remaningChangeDue = useMemo(() => {
        const remaining = changes.reduce((acc, c) => acc + c?.amountInUSD || 0, 0)
        return remaining > 0 ? remaining: 0
    }, [changes])
    
    // function to add payment method to payment list 
    const handleAddPayment = () => {
        if (!currentAmount || parseFloat(currentAmount) <=0) {
            setModalMessage('Por favor ingresa un monto valido...')
            setShowModal(true)
            return
        }

        const methodId = selectedPaymentMethodId || (paymentOptions[0]?.value)
        const paymentMethod = paymentMethods.find(pm => pm.id === parseInt(methodId))

        if (!paymentMethod) {
            setModalMessage('Metodo de pago no seleccionado')
            setShowModal(true)
            return
        } 
        
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
            setModalMessage(`Los pagos electronicos no pueden exceder el total. Monto maximo permitido en este metodo de pago: ${maxAllowed}`)
            setShowModal(true)
            return 
        }

        const isCreditMethod = paymentMethod.name.toLowerCase().includes('credito') || 
                           paymentMethod.name.toLowerCase().includes('crédito')

        if (isCreditMethod) {
            
            if (!customer) {
                setModalMessage('Debes seleccionar un cliente para poder utilizar el Crédito de Tienda.')
                setShowModal(true)
                return
            }

            const creditAlreadyUsedUSD = payments
            .filter(p => p.name.toLowerCase().includes('credito') || p.name.toLowerCase().includes('crédito'))
            .reduce((sum, p) => sum + p.amountInUSD, 0)

            const availableCreditUSD = (parseFloat(customer.total_credits) || 0) - creditAlreadyUsedUSD

            if (amountInUSD > (availableCreditUSD + 0.01)) {
           
                const maxAllowedFormatted = isBolivar 
                    ? (availableCreditUSD * exchangeRate).toFixed(2) + " Bs" 
                    : availableCreditUSD.toFixed(2) + " $"

                setModalMessage(`Crédito insuficiente. El cliente dispone de ${maxAllowedFormatted} de crédito restante, pero estás intentando ingresar ${inputAmount} ${isBolivar ? 'Bs' : '$'}.`)
                setShowModal(true)
                return
            }
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

    // function to add change 
    const handleAddChange = () => {
        if (!currentAmount || parseFloat(currentAmount) <= 0) {
            setModalMessage('Por favor ingresa un monto válido para el vuelto...')
            setShowModal(true)
            return
        }

        const methodId = selectedPaymentMethodId || (paymentOptions[0]?.value)
        const paymentMethod = paymentMethods.find(pm => pm.id === parseInt(methodId))

        if (!paymentMethod) {
            setModalMessage('Método de pago no seleccionado')
            setShowModal(true)
            return
        }

        const inputAmount = parseFloat(currentAmount)
        const isBolivar = paymentMethod.currency === 'Bolivar Digital'

        // Conversion of the change entered to reference USD
        const amountInUSD = Number(
            isBolivar ? inputAmount / exchangeRate : inputAmount
        )

        
        // Calculate how much change has already been broken down/allocated by the cashier
        const totalChangesAllocatedUSD = changes.reduce((acc, c) => acc + c.amountInUSD, 0)
        const remainingChangeUSD = Number((changeDueUSD - totalChangesAllocatedUSD).toFixed(2))

        // Critical validation: That the cashier does not try to give more change than the actual amount.
        if (amountInUSD > (remainingChangeUSD + 0.01)) {
            const maxAllowed = isBolivar 
                ? (remainingChangeUSD * exchangeRate).toFixed(2) + " Bs" 
                : remainingChangeUSD.toFixed(2) + " $"
            setModalMessage(`El monto indicado supera el vuelto restante por entregar. Máximo permitido: ${maxAllowed}`)
            setShowModal(true)
            return
        }

        setChanges(prev => [
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

    // Delete an incorrect change breakdown
    const removeChange = (index) => {
        setChanges(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmitInvoice = (formData) => {

        if (remainingToPayUSD > 0.01) {
            setModalMessage(`Falta por completar el pago. Restan: ${remainingToPayUSD.toFixed(2)} $`)
            setShowModal(true)
            return
        }

        // Validation: If change is due, require it to be fully itemized.
        if (changeDueUSD > 0.01) {
            const totalChangesAllocatedUSD = changes.reduce((acc, c) => acc + c.amountInUSD, 0)
            if (Math.abs(changeDueUSD - totalChangesAllocatedUSD) > 0.01) {
                const pendingUSD = (changeDueUSD - totalChangesAllocatedUSD).toFixed(2)
                setModalMessage(`Falta por desglosar la totalidad del vuelto. Restan por asignar: ${pendingUSD} $`)
                setShowModal(true)
                return
            }
        }

        if (items.length < 1) {
            setModalMessage('La factura tiene que tener productos')
            setShowModal(true)
            return
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
        formData.append('changes', JSON.stringify(changes))

        // send form to formAction
        return formAction(formData)
    }
    
    const handleReset = () => {
        setItems([])
        setActiveScreen('products')
        setCustomer(null)
        setPayments([])
        setChanges([])
        setActiveChange(false)
        setCurrentAmount('')
        setResetKey(prev => prev + 1)
        setSelectedPaymentMethodId('')
        SetResetTime(10)
        clearInvoiceStorage()
        const fd = new FormData()
        fd.append('reset', 'true')
        
        startTransition(() => {
            formAction(fd)
        })

    }

    // function to load store credits if it is available
    useEffect(() => {
        if (customer) {
            const totalCredits = parseFloat(customer?.total_credits || 0)
            const hasCredits = totalCredits > 0

            const creditMethod = paymentMethods.find(pm => 
            pm.name.toLowerCase().includes('credito') || pm.name.toLowerCase().includes('crédito'))

            const posMethod = paymentMethods.find(pm => 
            pm.name.toLowerCase().includes('punto') || pm.name.toLowerCase().includes('venta'))

            if (hasCredits && creditMethod) {
                setSelectedPaymentMethodId(creditMethod.id)
            } else if (posMethod) {
                setSelectedPaymentMethodId(posMethod.id)
            } else {
                setSelectedPaymentMethodId(paymentMethods[0]?.id || '')
            }
        }else {
            const posMethod = paymentMethods.find(pm => 
            pm.name.toLowerCase().includes('punto') || pm.name.toLowerCase().includes('venta'))
            setSelectedPaymentMethodId(posMethod?.id || paymentMethods[0]?.id || '')
        }
    }, [customer, paymentMethods])
    
    //function to complete amount when store credit is selected
    useEffect(() => {
        if (!customer) return 

        const availableCredit = parseFloat(customer?.total_credits || 0)

        const selectedMethod = paymentMethods.find(pm => pm.id === selectedPaymentMethodId)
        const isCredit = selectedMethod?.name.toLowerCase().includes('credito') ||
                         selectedMethod?.name.toLowerCase().includes('crédito')
        
        

        if (isCredit && availableCredit > 0) {
            const totalInvoice = parseFloat(total.total_usd || 0)
            if (availableCredit < totalInvoice) {
                setCurrentAmount(availableCredit.toFixed(2))
            } else {
                setCurrentAmount(totalInvoice.toFixed(2))
            }
        }

    }, [selectedPaymentMethodId, customer, total, paymentMethods])

    // reset function
    useEffect(() => {
        if (!state?.message) return
                
        const intervalId = setInterval(() => {
            SetResetTime(seconds => seconds -1)
        }, 1000)        
        
        return () => clearInterval(intervalId)     
        
    }, [state])

    // reset on time 0
    useEffect(() => {
        if (resetTime === 0) {
            handleReset()
        }
    }, [resetTime])

    // reset screen on delete all items
    useEffect(() => {
        if(items.length < 1) {
            setActiveScreen('products')
            setChanges([])
        }
    }, [items])

    //Keyboard shortcuts
    useEffect(() => {
        const shortcut = (event) => {
            if(state?.message) return

            const shortcuts = ['f1', 'f2', 'f3']
            const key = event.key.toLowerCase()
            
            const screens = {
                f1: 'products',
                f2: 'customer',
                f3: 'pay'
            }
            
            if (shortcuts.includes(key)) {
                event.preventDefault()
                if (key === 'f2' && items.length < 1 ) return
                if (key === 'f3' && !customer ) return 
                setActiveScreen(screens[key])
            }
            
        }
        window.addEventListener('keydown', shortcut)
        return () => window.removeEventListener('keydown', shortcut)
    }, [items, customer, state])
    

    // handle credit info message 
    const creditMessage = () => {
        if (!customer) return 
        
        const availableCredit = parseFloat(customer?.total_credits || 0)
        const selectedMethod = paymentMethods.find(pm => pm.id === selectedPaymentMethodId)
        const isCredit = selectedMethod?.name.toLowerCase().includes('credito') || 
                         selectedMethod?.name.toLowerCase().includes('crédito')
        
        if (!isCredit || availableCredit <= 0) return null

        const totalInvoice = parseFloat(total.total_usd || 0)
        
        if (availableCredit < totalInvoice) {
            return (
                <div style={{ marginTop: '8px', color: '#d97706', fontSize: '14px', fontWeight: '500' }}>
                    ⚠️ Se aplicará el saldo máximo disponible: <strong>{availableCredit.toFixed(2)}$</strong> de Crédito Tienda.
                </div>
            )
        }

        return (
            <div style={{ marginTop: '8px', color: '#16a34a', fontSize: '14px', fontWeight: '500' }}>
                ✅ Usar <strong>{totalInvoice.toFixed(2)}$</strong> de los <strong>{availableCredit.toFixed(2)}$</strong> disponibles en su Crédito Tienda.
            </div>
        )
    }
    
    return (
        <div className={styles.mainContainer}>
            <form className={styles.mainContainer} action={handleSubmitInvoice}>
                {/* products section */}
                <div className={`${styles.searchContainer} ${activeScreen !== 'products' ? styles.hide : ''}`}>
                    <InvoiceActionButtons items={items} 
                        screen={setActiveScreen} 
                        activeScreen={activeScreen}
                        customer={customer}
                        state={state}
                    />
                    <ProductSelector  setItems={setItems} items={items} activeScreen={activeScreen} changes={changes} setChanges={setChanges}/>
                </div>

                {/* customer section */}
                <div className={`${styles.searchContainer} ${activeScreen !== 'customer' ? styles.hide : ''}`}>
                    <InvoiceActionButtons items={items} 
                        screen={setActiveScreen} 
                        activeScreen={activeScreen}
                        customer={customer}
                        state={state}
                    />
                    <SelectCustomer customer={customer} setCustomer={setCustomer} showResult={false} bgColor={'white'} activeScreen={activeScreen}/>
                </div>

                {/* pay section */}
                <div className={`${styles.searchContainer} ${activeScreen !== 'pay' ? styles.hide : ''}`}>
                    <InvoiceActionButtons items={items} 
                        screen={setActiveScreen} 
                        activeScreen={activeScreen}
                        customer={customer}
                        state={state}
                    /> 
                   
                    <Select 
                        name='payment_method_id' 
                        options={paymentOptions}
                        value={selectedPaymentMethodId}
                        resetKey={resetKey}
                        onChange={(payment) => setSelectedPaymentMethodId(payment.value)}
                        disabled={state?.message ? true : false}
                        customer={customer}
                    />
                    {creditMessage()}
                    <InputAddPay setAmount={setCurrentAmount} 
                                 addPayment={handleAddPayment} 
                                 amount={currentAmount}
                                 remainingToPayUSD={remainingToPayUSD}
                                 isPending={isPending}
                                 state={state}
                                 activeScreen={activeScreen}
                                 paymentMethodId={selectedPaymentMethodId}
                                 paymentMethods={paymentMethods}
                                 exchangeRate={exchangeRate}
                                 changeDueUSD={changeDueUSD}
                                 setActiveChange={setActiveChange}
                                 activeChange={activeChange}
                                 addChange={handleAddChange}
                                 remaningChangeDue={remaningChangeDue}
                                 selectedPaymentMethodId={selectedPaymentMethodId}
                                 />
    
                    <div className={`divider`}></div>
                    
                    {/* success info */}
                    { state?.message && <SuccessInfo state={state} onClick={handleReset} time={resetTime}/> }

                    
                    <TotaInfo 
                        total={total} 
                        totalPaidUSD={totalPaidUSD} 
                        exchangeRate={exchangeRate} 
                        remainingToPayUSD={remainingToPayUSD}
                        changeDueUSD={changeDueUSD}
                        activeChange={activeChange}
                        remaningChangeDue={remaningChangeDue}
                    />
                    

                    <div className={`divider`}></div>

                    {/* payments */}
                    {
                        !state?.message && !activeChange && <Pyaments payments={payments} removePayment={removePayment}/>
                    }

                    {/* changes */}

                    {
                        !state?.message && activeChange && <Pyaments payments={changes} removePayment={removeChange}/>
                    }
                </div>

                {/* cart section */}
                <div className={styles.cartContainer}>
                    <Cart items={items} setItems={setItems} total={total} state={state} totalPaidUSD={totalPaidUSD}/>
                </div>
            </form>
         
            {/* modal for alert messages */}
            <Modal 
                show={showModal}
                title={'No se puede realizar esta acción'}
                showIcon={true}
                onClose={closeModal}
                icon='warning'
                iconColor='var(--color-accentRed400)'>
                    <Container 
                        className={styles.modalContent}
                        direction={'column'}
                        width={'100%'}
                    >
                        <p>{modalMessage}</p>
                    </Container>
                    <Button
                            type={'danger'}
                            onClick={closeModal}
                            style={{marginTop: '24px', width: '80%'}}
                        >
                            Aceptar
                    </Button>
            </Modal>
        </div>
    )
}
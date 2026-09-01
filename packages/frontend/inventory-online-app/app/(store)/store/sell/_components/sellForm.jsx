'use client'
import ProductSelector from '@/app/(store)/store/sell/_components/product/productSelector'
import Cart from '@/app/(store)/store/sell/_components/cart/cart'
import styles from './sell.module.css'
import SelectCustomer from '@/app/(store)/store/sell/_components/customer/customer'
import SelectObject from '@/app/utils/selectObject'
import Select from '@/app/ui/select/select'
import CreateInvoiceAction from '@/app/lib/actions/createInvoice'
import AuthorizeAction from '@/app/lib/actions/authorize'
import GetItemAction from '@/app/lib/actions/get'
import InvoiceActionButtons from '@/app/(store)/store/sell/_components/buttons/buttons'
import InputAddPay from '@/app/(store)/store/sell/_components/payInputButton/payInputButton'
import TotaInfo from '@/app/(store)/store/sell/_components/totalInfo/totalInfo'
import Pyaments from '@/app/(store)/store/sell/_components/payments/payments'
import SuccessInfo from '@/app/(store)/store/sell/_components/success/success'
import ActionModal from '@/app/ui/actionModal/actionModal'
import { Modal } from '@/app/ui/utils/alert/modal'
import { Button } from '@/app/ui/utils/button/buttons'
import { Container } from '@/app/ui/utils/container'
import { useState, useMemo, useActionState, useEffect, startTransition, useRef } from 'react'
const STORE_CREDIT_ID = process.env.NEXT_PUBLIC_STORE_CREDIT_ID || 99

// Only for floating-point noise from currency conversion (dividing a Bs
// amount by a live exchange rate), never a business "acceptable shortfall".
// Must stay far below one cent so the frontend can never call a sale
// "complete" here while the backend's exact `total_paid >= total` check
// would still leave the invoice as 'unpaid'.
const FLOAT_EPSILON = 0.001

// Payment methods a cashier can actually hand back as "vuelto" (change):
// cash, and any method that can send money back to the customer directly
// (pago móvil, transferencia, cripto). IDs come from the fixed seeder
// catalog — the same for every tenant, see
// packages/backend/src/seeders/20250616062547-seed-payment-methods.js:
// 2 Pago Movil, 3 Transferencia, 4 Efectivo Bolivares, 5 Efectivo Dolares,
// 6 Transferencia Dolares, 7 Cripto.
// Deliberately excluded: 1 Punto de venta, 8 Biopago, 9 Cashea — those only
// register a transaction on a card/POS terminal, there's no way to physically
// or digitally hand money back through them. Store Credit is excluded too
// (never applicable as a change method).
const CHANGE_ELIGIBLE_PAYMENT_IDS = [2, 3, 4, 5, 6, 7]


export default function SellForm({ paymentMethods=[], exchangeRate=null, currentUser=null, storeInactive=false, blockedReason=null}) {
    const [activeScreen, setActiveScreen] = useState('products')
    const [items, setItems] = useState([])
    const [customer, setCustomer] = useState(null)
    const [payments, setPayments] = useState([])
    const [changes, setChanges] = useState([])
    const [resetKey, setResetKey] = useState(0)
    const [activeChange, setActiveChange] = useState(false)
    const [cartMode, setCartMode] = useState(false)
    const [cartHighlightedIndex, setCartHighlightedIndex] = useState(-1)
    const [isCredit, setIsCredit] = useState(false)
    const [showSupervisorModal, setShowSupervisorModal] = useState(false)
    const [supervisorPin, setSupervisorPin] = useState('')
    const [isCreditAuthorized, setIsCreditAuthorized] = useState(currentUser?.permissions.includes('update') ? true : false)
    const formRef = useRef(null)
    const paymentSelectRef = useRef(null)
    const productSelectorRef = useRef(null)

    // local state to control actual amount
    const [currentAmount, setCurrentAmount] = useState('')
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(1)
    const paymentOptions = SelectObject(paymentMethods, 'id', 'name')

    // Filtered list for when the cashier is breaking down "vuelto" (change):
    // only methods that can actually give money back to the customer.
    const changeEligiblePaymentMethods = useMemo(() => {
        return paymentMethods.filter(pm => CHANGE_ELIGIBLE_PAYMENT_IDS.includes(pm.id))
    }, [paymentMethods])
    const changePaymentOptions = SelectObject(changeEligiblePaymentMethods, 'id', 'name')
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [resetTime, SetResetTime] = useState(15)

    // form action
    const initialState = {message: null, error: null}
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

        if (storedCustomer) setCustomer(JSON.parse(storedCustomer))
        if (storedPayments) setPayments(JSON.parse(storedPayments))
        if (storedChanges) setChanges(JSON.parse(storedChanges))

        // A cart restored from localStorage can be minutes or days old, and
        // whatever it says about price/stock is whatever was true when it
        // was saved. The invoice we actually create always charges the
        // live DB price regardless (see ProductService.getProductUnitPrice
        // on the backend) — this is purely so the screen never shows the
        // cashier a total that won't match what the backend ends up
        // charging. Re-checks every restored item against the current
        // product data, drops products that no longer exist or are out of
        // stock, and clamps quantity down if stock shrank below what was
        // saved.
        const restoreItems = async () => {
            if (!storedItems) return
            const parsedItems = JSON.parse(storedItems)
            if (parsedItems.length < 1) return

            const refreshedItems = await Promise.all(
                parsedItems.map(async (item) => {
                    const { data } = await GetItemAction(`products/${item.id}`)
                    const freshProduct = data?.product

                    if (!freshProduct || freshProduct.stock <= 0) return null

                    return {
                        ...item,
                        name: freshProduct.name,
                        selling_price: freshProduct.selling_price,
                        reference_selling_price: freshProduct.reference_selling_price,
                        stock: freshProduct.stock,
                        quantity: Math.min(item.quantity, freshProduct.stock)
                    }
                })
            )

            setItems(refreshedItems.filter(Boolean))
        }

        restoreItems()
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
        if (!isCash && amountInUSD > (remainingToPayUSD + FLOAT_EPSILON)) {
            const maxAllowed = isBolivar ? (remainingToPayUSD * exchangeRate).toFixed(2) + "Bs" : remainingToPayUSD.toFixed(2) + "$"
            setModalMessage(`Los pagos electronicos no pueden exceder el total. Monto maximo permitido en este metodo de pago: ${maxAllowed}`)
            setShowModal(true)
            return
        }

        const isCreditMethod = methodId == STORE_CREDIT_ID

        if (isCreditMethod) {

            if (!customer) {
                setModalMessage('Debes seleccionar un cliente para poder utilizar el Crédito de Tienda.')
                setShowModal(true)
                return
            }

            const creditAlreadyUsedUSD = payments
            .filter(p => p.id == STORE_CREDIT_ID)
            .reduce((sum, p) => sum + p.amountInUSD, 0)

            const availableCreditUSD = (parseFloat(customer.total_credits) || 0) - creditAlreadyUsedUSD

            if (amountInUSD > (availableCreditUSD + FLOAT_EPSILON)) {

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
        if (amountInUSD > (remainingChangeUSD + FLOAT_EPSILON)) {
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

        if (remainingToPayUSD > FLOAT_EPSILON && !isCredit) {
            setModalMessage(`Falta por completar el pago. Restan: ${remainingToPayUSD.toFixed(2)} $`)
            setShowModal(true)
            return
        }

        formData.append('pin', supervisorPin)

        // Validation: If change is due, require it to be fully itemized.
        if (changeDueUSD > FLOAT_EPSILON) {
            const totalChangesAllocatedUSD = changes.reduce((acc, c) => acc + c.amountInUSD, 0)
            if (Math.abs(changeDueUSD - totalChangesAllocatedUSD) > FLOAT_EPSILON) {
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

    //function to activate credit mode
    const handleCreditToggle = () => {
        if (!isCreditAuthorized && !currentUser?.permissions.includes('update')) {
            setShowSupervisorModal(true)
        } else {
            setIsCredit(prev => !prev)
            setIsCreditAuthorized(prev => !prev)
        }
    }

    const handleReset = () => {
        setItems([])
        setActiveScreen('products')
        setCustomer(null)
        setPayments([])
        setChanges([])
        setActiveChange(false)
        setCartMode(false)
        setCartHighlightedIndex(-1)
        setCurrentAmount('')
        setResetKey(prev => prev + 1)
        setSelectedPaymentMethodId('')
        SetResetTime(10)
        clearInvoiceStorage()
        setIsCredit(false)
        setIsCreditAuthorized(currentUser?.permissions.includes('update') ? true : false)
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
            pm.id == STORE_CREDIT_ID)

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
        const isCredit = selectedMethod?.id == STORE_CREDIT_ID



        if (isCredit && availableCredit > 0) {
            const totalInvoice = parseFloat(total.total_usd || 0)
            if (availableCredit < totalInvoice) {
                setCurrentAmount(availableCredit.toFixed(2))
            } else {
                setCurrentAmount(totalInvoice.toFixed(2))
            }
        }

    }, [selectedPaymentMethodId, customer, total, paymentMethods])

    // When entering "Gestionar Vuelto" mode, make sure the selected payment
    // method is one that can actually give change back. Without this, if the
    // cashier had e.g. "Punto de venta" selected for the sale, the Select
    // would silently keep submitting that id for the change breakdown while
    // just displaying the first eligible option's label instead (Select
    // falls back to options[0]'s label when the current value isn't among
    // the options it's given) — the change would get logged under the wrong
    // payment method.
    useEffect(() => {
        if (!activeChange) return
        const isEligible = changeEligiblePaymentMethods.some(pm => pm.id == selectedPaymentMethodId)
        if (!isEligible) {
            setSelectedPaymentMethodId(changeEligiblePaymentMethods[0]?.id || '')
        }
    }, [activeChange, changeEligiblePaymentMethods])

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
            setCartMode(false)
            setCartHighlightedIndex(-1)
        }
    }, [items])

    // Leaves "cart mode" (see the Alt+C shortcut below): drops the row
    // highlight and, if we're looking at the product screen, sends focus
    // back to the search box so the cashier can keep scanning right away.
    const exitCartMode = () => {
        setCartMode(false)
        setCartHighlightedIndex(-1)
        if (activeScreen === 'products') {
            productSelectorRef.current?.focusInput()
        }
    }

    //Keyboard shortcuts
    useEffect(() => {
        const shortcut = (event) => {
            if(state?.message) return

            const key = event.key.toLowerCase()

            // Alt+C: toggle "cart mode". Lets a whole line be entered with
            // the keyboard alone — scan/add a product once, Alt+C into the
            // cart, then bump its quantity with the arrow keys instead of
            // reaching for the mouse or scanning the same barcode 5 more
            // times (e.g. a customer taking 6 of the same soap).
            if (event.altKey && key === 'c') {
                event.preventDefault()
                if (cartMode) {
                    exitCartMode()
                } else {
                    if (items.length < 1) return
                    setCartMode(true)
                    setCartHighlightedIndex(items.length - 1)
                }
                return
            }

            if (cartMode) {
                if (key === 'escape' || key === 'enter') {
                    event.preventDefault()
                    exitCartMode()
                    return
                }

                if (key === 'arrowup' || key === 'arrowdown') {
                    event.preventDefault()
                    setCartHighlightedIndex(prev => {
                        if (items.length < 1) return -1
                        if (key === 'arrowdown') return prev < items.length - 1 ? prev + 1 : 0
                        return prev > 0 ? prev - 1 : items.length - 1
                    })
                    return
                }

                if (key === 'arrowright' || key === 'arrowleft') {
                    event.preventDefault()
                    setItems(prev => prev.map((item, index) => {
                        if (index !== cartHighlightedIndex) return item
                        const currentQuantity = parseInt(item.quantity) || 0
                        const nextQuantity = key === 'arrowright'
                            ? Math.min(currentQuantity + 1, item.stock)
                            : Math.max(1, currentQuantity - 1)
                        return {...item, quantity: nextQuantity}
                    }))
                    return
                }

                if (key === 'delete' || key === 'backspace') {
                    event.preventDefault()
                    setItems(prev => prev.filter((_, index) => index !== cartHighlightedIndex))
                    setCartHighlightedIndex(prev => Math.min(prev, items.length - 2))
                    return
                }
            }

            const shortcuts = ['f1', 'f2', 'f3']

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
                return
            }

            // F4: jump straight into the payment method selector and open it,
            // instead of relying on Tab order to reach it from wherever focus
            // currently is (e.g. the amount input, several fields away).
            if (key === 'f4') {
                if (activeScreen !== 'pay') return
                event.preventDefault()
                paymentSelectRef.current?.openAndFocus()
            }

        }
        window.addEventListener('keydown', shortcut)
        return () => window.removeEventListener('keydown', shortcut)
    }, [items, customer, state, activeScreen, cartMode, cartHighlightedIndex])


    // handle credit info message
    const creditMessage = () => {
        if (!customer) return

        const availableCredit = parseFloat(customer?.total_credits || 0)
        const selectedMethod = paymentMethods.find(pm => pm.id === selectedPaymentMethodId)
        const isCredit = selectedMethod?.id == STORE_CREDIT_ID

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
            <form ref={formRef} className={styles.mainContainer} action={handleSubmitInvoice}>
                {/* products section */}
                <div className={`${styles.searchContainer} ${activeScreen !== 'products' ? styles.hide : ''}`}>
                    <InvoiceActionButtons items={items}
                        screen={setActiveScreen}
                        activeScreen={activeScreen}
                        customer={customer}
                        state={state}
                        storeInactive={storeInactive}
                        blockedReason={blockedReason}
                    />
                    <ProductSelector  ref={productSelectorRef} setItems={setItems} items={items} activeScreen={activeScreen} changes={changes} setChanges={setChanges}/>
                    {
                        items.length > 0 &&
                        <div className={styles.cancelContainer}>
                            <Button
                                type={'secondary'}
                                onClick={handleReset}
                                showIcon={true}
                                icon={'trash'}
                                size={[24, 24]}
                                title={'Cancelar esta venta'}
                                className='shadow-sm'
                                disabled={isPending || state?.message ? true : false}
                                children={'Cancelar venta'}
                            />
                        </div>
                    }
                </div>

                {/* customer section */}
                <div className={`${styles.searchContainer} ${activeScreen !== 'customer' ? styles.hide : ''}`}>
                    <InvoiceActionButtons items={items}
                        screen={setActiveScreen}
                        activeScreen={activeScreen}
                        customer={customer}
                        state={state}
                        storeInactive={storeInactive}
                        blockedReason={blockedReason}
                    />
                    <SelectCustomer customer={customer} setCustomer={setCustomer} showResult={false} bgColor={'white'} activeScreen={activeScreen}/>
                    <div className={styles.cancelContainer}>
                        <Button
                            type={'secondary'}
                            onClick={handleReset}
                            showIcon={true}
                            icon={'trash'}
                            size={[24, 24]}
                            title={'Cancelar esta venta'}
                            className='shadow-sm'
                            disabled={isPending || state?.message ? true : false}
                            children={'Cancelar venta'}
                        />
                    </div>
                </div>

                {/* pay section */}
                <div className={`${styles.searchContainer} ${activeScreen !== 'pay' ? styles.hide : ''}`}>
                    <InvoiceActionButtons items={items}
                        screen={setActiveScreen}
                        activeScreen={activeScreen}
                        customer={customer}
                        state={state}
                        storeInactive={storeInactive}
                        blockedReason={blockedReason}
                    />

                    <Select
                        ref={paymentSelectRef}
                        name='payment_method_id'
                        options={activeChange ? changePaymentOptions : paymentOptions}
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
                                 currentUser={currentUser}
                                 isCredit={isCredit}
                                 setIsCredit={setIsCredit}
                                 />

                    <div className={`divider`}></div>

                    {/* success info */}
                    { state?.message && <SuccessInfo state={state} onClick={handleReset} time={resetTime}/> }

                    {/* error info */}
                    {state?.error && <span className="field_error">{state?.error}</span>}



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

                    <Container
                        height={'100%'}
                        justifyContent={'space-between'}
                        alignItem={'end'}
                        padding={'0px'}
                    >

                        <Button
                            type={'secondary'}
                            onClick={handleReset}
                            showIcon={true}
                            icon={'trash'}
                            size={[24, 24]}
                            title={'Cancelar esta venta'}
                            className='shadow-sm'
                            disabled={isPending || state?.message ? true : false}
                            children={'Cancelar venta'}
                        />

                        {
                            payments.length < 1 &&
                            <Button
                                type={'danger'}
                                onClick={handleCreditToggle}
                                showIcon={true}
                                icon={'coins'}
                                size={[24, 24]}
                                title={'Procesar Factura A Crédito'}
                                className='shadow-sm'
                                disabled={isPending || state?.message ? true : false}
                                children={isCredit ? 'Cancelar venta a crédito' : 'Procesar factura a crédito'}
                            />
                        }

                    </Container>
                </div>


                {/* cart section */}
                <div className={styles.cartContainer}>
                    <Cart items={items} setItems={setItems} total={total} state={state} totalPaidUSD={totalPaidUSD} highlightedIndex={cartMode ? cartHighlightedIndex : -1}/>
                </div>

            </form>

            {/* modal for alert messages */}
            <Modal
                show={showModal}
                title={'No se puede realizar esta acción'}
                showIcon={true}
                onClose={closeModal}
                icon='warning'
                ignoreEnter={true}
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

            {/* Modal para solicitar PIN del Supervisor */}
            {showSupervisorModal && (
                <ActionModal
                    show={showSupervisorModal}
                    onClose={() => setShowSupervisorModal(false)}
                    title="Autorización de Supervisor"
                    message="Se requiere el PIN de un supervisor para habilitar la venta a crédito."
                    icon="padlock"
                    iconColor="var(--color-accentBlue400)"
                    confirmText="Autorizar"
                    confirmType="primary"
                    requirePin={true}
                    pin={supervisorPin}
                    onChangePin={true}
                    customPin={setSupervisorPin}
                    action={AuthorizeAction}

                    onSuccess={(state) => {
                        if (state?.message) {
                            setIsCreditAuthorized(true)
                            setShowSupervisorModal(false)
                            setIsCredit(true)
                        }
                    }}
                />
            )}

        </div>
    )
}

'use client'
import { Button } from '@/app/ui/utils/button/buttons'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useRef, useEffect } from 'react'
import ManageChange from '@/app/(store)/store/sell/_components/manageChange/manageChange'
import styles from './payInputButton.module.css'

// Only for floating-point noise from the Bs -> USD conversion (division by a
// live exchange rate), never a business "acceptable shortfall". Must stay far
// below one cent so it can never let an underpaid sale look "complete" here
// while the backend's exact `total_paid >= total` check would reject it.
const FLOAT_EPSILON = 0.001

export default function InputAddPay({setAmount=() => '', addPayment=() => '', amount='', remainingToPayUSD=1, isPending=true, state={},
                    activeScreen=null,
                    paymentMethodId=null,
                    paymentMethods=[],
                    exchangeRate=0,
                    changeDueUSD=null,
                    setActiveChange= () => '',
                    activeChange=false,
                    addChange=() => '',
                    remaningChangeDue=null,
                    selectedPaymentMethodId=null,
                    isCredit=false,
                    setIsCredit= () => ''
                    }) {

    const inputRef = useRef(null)
    const submitRef = useRef(null)
    const creditRef = useRef(null)

    useEffect(() => {
        if (activeScreen === 'pay') {
            inputRef.current?.focus()
        }
    }, [activeScreen, paymentMethodId])

    useEffect(() => {
        const setTotalAmount = (event) => {
            const key = event.key.toLowerCase()

            if(key == 'end'){
                if (remainingToPayUSD < FLOAT_EPSILON) return submitRef.current?.click()
                event.preventDefault()
                const methodIdToSearch = selectedPaymentMethodId || paymentMethods[0]?.id
                const payment = paymentMethods.find(pm => pm.id === parseInt(methodIdToSearch))

                if (!payment) {
                    console.warn('No se pudo determinar el método de pago seleccionado.')
                    return
                }

                const isBolivar = payment.currency === 'Bolivar Digital'

                const total_amount = isBolivar
                    ? (remainingToPayUSD * exchangeRate).toFixed(2)
                    : remainingToPayUSD.toFixed(2);

                setAmount(total_amount)
                inputRef.current?.focus()
            }
        }
        if (activeScreen == 'pay') {
            window.addEventListener('keydown', setTotalAmount)
            return () => window.removeEventListener('keydown', setTotalAmount)
        }
    }, [activeScreen, selectedPaymentMethodId, remainingToPayUSD, paymentMethods, exchangeRate])

    useEffect(() => {
        if (!activeChange) {
            setAmount('')
        }
    }, [activeChange])

    const handleCredit = () => {
        setIsCredit(true)
    }

    return (
        <div className={styles.container}>
            {
                !isCredit &&
                <input
                    ref={inputRef}
                    className={`${styles.amountInput} ${remainingToPayUSD <= FLOAT_EPSILON ? activeChange ? '' : styles.disabledInput : ''}
                        ${(remaningChangeDue >= (changeDueUSD - FLOAT_EPSILON) && activeChange) ? styles.disabledInput : ''}
                        shadow-sm`}
                    autoComplete='off'
                    type="number"
                    name="amount"
                    value={amount}
                    onChange={
                        (e) => setAmount(e.target.value)
                    }
                    placeholder="Monto"
                    min="0.1"
                    step="0.01"
                    disabled={((remainingToPayUSD <= FLOAT_EPSILON || isPending) && !activeChange) || ( activeChange && remaningChangeDue >= (changeDueUSD - FLOAT_EPSILON))}
                    onKeyDown={
                        (e) => {
                            if (e.key === 'Enter' && !activeChange){
                                e.preventDefault();
                                addPayment();
                            }
                            if (e.key === 'Enter' && activeChange){
                                e.preventDefault();
                                addChange();
                            }
                        }
                    }
                />
            }

            {
                remainingToPayUSD > FLOAT_EPSILON && !isCredit && (
                    <Button type={'secondary'}
                        onClick={addPayment}
                        showIcon={true}
                        icon={'sell'}
                        size={[24, 24]}
                        title={'Agregar Pago'}
                        children={'Agregar'}
                        className='shadow-sm'
                    />
                )
            }

            {
                activeChange && remaningChangeDue.toFixed(2) < changeDueUSD.toFixed(2) && (
                    <Button type={'terteary'}
                        onClick={addChange}
                        showIcon={true}
                        icon={'sell'}
                        size={[24, 24]}
                        title={'Agregar Vuelto'}
                        children={'Agregar Vuelto'}
                        className='shadow-sm'
                    />
                )
            }

            {
                remainingToPayUSD <= FLOAT_EPSILON && (!changeDueUSD || remaningChangeDue >= (changeDueUSD - FLOAT_EPSILON) ) &&(
                    <Button type={'primary'}
                        ref={submitRef}
                        style={{backgroundColor: '#3E7C42'}}
                        role={'submit'}
                        showIcon={isPending ? false : true}
                        icon={'creditCard'}
                        size={[24, 24]}
                        title={'Procesar Factura'}
                        className='shadow-sm'
                        disabled={isPending || state?.message ? true : false}
                    >
                        {isPending && <OvalLoader/>}
                        {isPending ? 'Procesando...' : state?.message ? 'Venta Registrada' : 'Procesar Factura'}

                    </Button>
                )
            }

            {
                changeDueUSD > FLOAT_EPSILON && (
                    <Button type={'secondary'}
                        showIcon={true}
                        onClick={() => setActiveChange(!activeChange)}
                        icon={activeChange ? 'circleArrow' : 'cash_change'}
                        size={[24, 24]}
                        title={'Gestionar Vuelto'}
                        children={activeChange ? 'Regresar' : 'Gestionar Vuelto'}
                        className='shadow-sm'
                    />
                )
            }

            { isCredit && (
                    <Button
                        type={'primary'}
                        ref={creditRef}
                        style={{backgroundColor: '#3E7C42'}}
                        onClick={handleCredit}
                        role={'submit'}
                        showIcon={isPending ? false : true}
                        icon={'creditCard'}
                        size={[24, 24]}
                        title={'Hacer Factura Paga Despues'}
                        className='shadow-sm'
                        disabled={isPending || state?.message ? true : false}
                    >
                            {isPending && <OvalLoader/>}
                            {isPending ? 'Procesando...' : state?.message ? 'Venta Registrada' : 'Hacer Venta Y Pagar Despues'}

                    </Button>
                )
            }
        </div>
    )
}

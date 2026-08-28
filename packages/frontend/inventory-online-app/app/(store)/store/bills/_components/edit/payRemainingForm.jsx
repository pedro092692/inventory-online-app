'use client'
import { Container } from '@/app/ui/utils/container'
import Select from '@/app/ui/select/select'
import SelectObject from '@/app/utils/selectObject'
import InputAddPay from '@/app/(store)/store/sell/_components/payInputButton/payInputButton'
import Payments from '@/app/(store)/store/sell/_components/payments/payments'
import TotaInfo from '@/app/(store)/store/sell/_components/totalInfo/totalInfo'
import CreateInvoiceAction from '@/app/lib/actions/createInvoice'
import { useState, useMemo, useActionState } from 'react'
import styles from './invoice.module.css'

// Lets you settle the remaining balance of an invoice that is unpaid or was left
// as store credit. Mirrors the "pay" step of the POS sale form (same building
// blocks: payment method select, amount input, payments/change breakdown) but
// against an invoice that already exists instead of a cart being created.
export default function PayRemainingForm({ invoice = null, paymentMethods = [] , exchangeRate = null }) {
    const [payments, setPayments] = useState([])
    const [changes, setChanges] = useState([])
    const [currentAmount, setCurrentAmount] = useState('')
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(paymentMethods[0]?.id || '')
    const [activeChange, setActiveChange] = useState(false)

    const paymentOptions = SelectObject(paymentMethods, 'id', 'name')

    const initialState = { message: null, error: null }
    const payInvoice = CreateInvoiceAction.bind(null, 'Pago registrado con éxito 💰', true, invoice?.id)
    const [state, formAction, isPending] = useActionState(payInvoice, initialState)

    // what's already settled on the invoice, before anything added in this form
    const alreadyPaidUSD = parseFloat(invoice?.total_paid || 0)

    const total = useMemo(() => ({
        total_usd: parseFloat(invoice?.total || 0),
        total_bs: parseFloat(invoice?.total || 0) * (exchangeRate || 0)
    }), [invoice, exchangeRate])

    const totalPaidUSD = useMemo(() => {
        return alreadyPaidUSD + payments.reduce((acc, p) => acc + p.amountInUSD, 0)
    }, [payments, alreadyPaidUSD])

    const remainingToPayUSD = useMemo(() => {
        const remaining = total.total_usd - totalPaidUSD
        return remaining > 0 ? remaining : 0
    }, [total.total_usd, totalPaidUSD])

    const changeDueUSD = useMemo(() => {
        const change = totalPaidUSD - total.total_usd
        return change > 0 ? change : 0
    }, [total.total_usd, totalPaidUSD])

    const remaningChangeDue = useMemo(() => {
        const remaining = changes.reduce((acc, c) => acc + (c?.amountInUSD || 0), 0)
        return remaining > 0 ? remaining : 0
    }, [changes])

    const [validationMsg, setValidationMsg] = useState('')

    const handleAddPayment = () => {
        setValidationMsg('')

        if (!currentAmount || parseFloat(currentAmount) <= 0) {
            setValidationMsg('Por favor ingresa un monto válido.')
            return
        }

        const methodId = selectedPaymentMethodId || paymentOptions[0]?.value
        const paymentMethod = paymentMethods.find(pm => pm.id === parseInt(methodId))

        if (!paymentMethod) {
            setValidationMsg('Método de pago no seleccionado.')
            return
        }

        const inputAmount = parseFloat(currentAmount)
        const isBolivar = paymentMethod.currency === 'Bolivar Digital'
        const amountInUSD = Number(isBolivar ? inputAmount / exchangeRate : inputAmount)

        const isCash = paymentMethod.allow_change
        if (!isCash && amountInUSD > (remainingToPayUSD + 0.01)) {
            const maxAllowed = isBolivar ? (remainingToPayUSD * exchangeRate).toFixed(2) + ' Bs' : remainingToPayUSD.toFixed(2) + ' $'
            setValidationMsg(`Los pagos electrónicos no pueden exceder el total. Monto máximo permitido: ${maxAllowed}`)
            return
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

    const handleAddChange = () => {
        setValidationMsg('')

        if (!currentAmount || parseFloat(currentAmount) <= 0) {
            setValidationMsg('Por favor ingresa un monto válido para el vuelto.')
            return
        }

        const methodId = selectedPaymentMethodId || paymentOptions[0]?.value
        const paymentMethod = paymentMethods.find(pm => pm.id === parseInt(methodId))

        if (!paymentMethod) {
            setValidationMsg('Método de pago no seleccionado.')
            return
        }

        const inputAmount = parseFloat(currentAmount)
        const isBolivar = paymentMethod.currency === 'Bolivar Digital'
        const amountInUSD = Number(isBolivar ? inputAmount / exchangeRate : inputAmount)

        const totalChangesAllocatedUSD = changes.reduce((acc, c) => acc + c.amountInUSD, 0)
        const remainingChangeUSD = Number((changeDueUSD - totalChangesAllocatedUSD).toFixed(2))

        if (amountInUSD > (remainingChangeUSD + 0.01)) {
            const maxAllowed = isBolivar ? (remainingChangeUSD * exchangeRate).toFixed(2) + ' Bs' : remainingChangeUSD.toFixed(2) + ' $'
            setValidationMsg(`El monto supera el vuelto restante por entregar. Máximo permitido: ${maxAllowed}`)
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

    const removePayment = (index) => setPayments(prev => prev.filter((_, i) => i !== index))
    const removeChange = (index) => setChanges(prev => prev.filter((_, i) => i !== index))

    const handleSubmit = (formData) => {
        setValidationMsg('')

        if (remainingToPayUSD > 0.01) {
            setValidationMsg(`Falta por completar el pago. Restan: ${remainingToPayUSD.toFixed(2)} $`)
            return
        }

        if (changeDueUSD > 0.01) {
            const totalChangesAllocatedUSD = changes.reduce((acc, c) => acc + c.amountInUSD, 0)
            if (Math.abs(changeDueUSD - totalChangesAllocatedUSD) > 0.01) {
                const pendingUSD = (changeDueUSD - totalChangesAllocatedUSD).toFixed(2)
                setValidationMsg(`Falta por desglosar la totalidad del vuelto. Restan por asignar: ${pendingUSD} $`)
                return
            }
        }

        if (payments.length < 1) {
            setValidationMsg('Agrega al menos un método de pago.')
            return
        }

        formData.append('payments', JSON.stringify(payments))
        formData.append('changes', JSON.stringify(changes))

        return formAction(formData)
    }

    return (
        <Container
            width={'100%'}
            padding={'16px'}
            direction={'column'}
            alignItem={'start'}
            borderRadius={'8px'}
            backgroundColor={'var(--color-neutralGrey300)'}
            className={`shadow ${styles.form}`}
            gap={'12px'}
        >
            <h2 className='h3'>Registrar pago</h2>

            {state?.message ? (
                <p className='p2-b success_message'>{state.message}</p>
            ) : (
                <form action={handleSubmit}>
                    <Container padding={'0px'} direction={'column'} alignItem={'start'} gap={'12px'}>
                        <Select
                            name='payment_method_id'
                            options={paymentOptions}
                            value={selectedPaymentMethodId}
                            onChange={(payment) => setSelectedPaymentMethodId(payment.value)}
                            disabled={isPending}
                        />

                        <InputAddPay
                            setAmount={setCurrentAmount}
                            addPayment={handleAddPayment}
                            amount={currentAmount}
                            remainingToPayUSD={remainingToPayUSD}
                            isPending={isPending}
                            state={state}
                            activeScreen={'pay'}
                            paymentMethodId={selectedPaymentMethodId}
                            paymentMethods={paymentMethods}
                            exchangeRate={exchangeRate}
                            changeDueUSD={changeDueUSD}
                            setActiveChange={setActiveChange}
                            activeChange={activeChange}
                            addChange={handleAddChange}
                            remaningChangeDue={remaningChangeDue}
                            selectedPaymentMethodId={selectedPaymentMethodId}
                            isCredit={false}
                            setIsCredit={() => ''}
                        />

                        {validationMsg && <p className='p2-r errorMsg'>{validationMsg}</p>}
                        {state?.error && <p className='p2-r errorMsg'>{state.error}</p>}

                        <TotaInfo
                            total={total}
                            totalPaidUSD={totalPaidUSD}
                            exchangeRate={exchangeRate}
                            remainingToPayUSD={remainingToPayUSD}
                            changeDueUSD={changeDueUSD}
                            activeChange={activeChange}
                            remaningChangeDue={remaningChangeDue}
                        />

                        {!activeChange && <Payments payments={payments} removePayment={removePayment} />}
                        {activeChange && <Payments payments={changes} removePayment={removeChange} />}
                    </Container>
                </form>
            )}
        </Container>
    )
}

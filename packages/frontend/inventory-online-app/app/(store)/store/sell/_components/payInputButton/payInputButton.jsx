'use client'
import { Button } from '@/app/ui/utils/button/buttons'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useRef, useEffect } from 'react'
import ManageChange from '@/app/(store)/store/sell/_components/manageChange/manageChange'
import styles from './payInputButton.module.css'

export default function InputAddPay({setAmount=() => '', addPayment=() => '', amount='', remainingToPayUSD=1, isPending=true, state={}, 
                    activeScreen=null,
                    paymentMethodId=null,
                    paymentMethods=[],
                    exchangeRate=0,
                    changeDueUSD=null,
                    setActiveChange= () => '',
                    activeChange=false
                    }) {
    
    const inputRef = useRef(null)
    const submitRef = useRef(null)

    useEffect(() => {
        if (activeScreen === 'pay') {
            inputRef.current?.focus()
        }
    }, [activeScreen, paymentMethodId])

    useEffect(() => {
        const setTotalAmount = (event) => {
            const key = event.key.toLowerCase()
            
            if(key == 'end'){
                if (remainingToPayUSD < 0.01) return submitRef.current?.click()
                event.preventDefault()
                const payment = paymentMethods[paymentMethodId || 1 - 1]
                const total_amount = payment.currency != 'Bolivar Digital' || '' ? remainingToPayUSD.toFixed(2) : (remainingToPayUSD * exchangeRate).toFixed(2)
                setAmount(total_amount)
                inputRef.current?.focus()
            }
        }
        if (activeScreen == 'pay') {      
            window.addEventListener('keydown', setTotalAmount)
            return () => window.removeEventListener('keydown', setTotalAmount)
        }
    }, [activeScreen, paymentMethodId, remainingToPayUSD])

    return (
        <div className={styles.container}>
            <input 
            ref={inputRef}
            className={`${styles.amountInput} ${remainingToPayUSD <= 0.01 ? activeChange ? '' : styles.disabledInput : ''} shadow-sm`}
            autoComplete='off'
            type="number" 
            name="amount"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monto" 
            min="0.1" 
            step="0.01" 
            disabled={(remainingToPayUSD <= 0.01 || isPending) && !activeChange}
            onKeyDown={
                (e) => {
                    if (e.key === 'Enter'){
                        e.preventDefault();
                        addPayment();
                    }   
                }
            }
            />
            {
                remainingToPayUSD > 0.01 && (
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
                remainingToPayUSD <= 0.01 && !changeDueUSD &&(
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
                changeDueUSD > 0.01 && (
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
            
        </div>
    )
}
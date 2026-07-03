'use client'
import { Button } from '@/app/ui/utils/button/buttons'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useRef, useEffect } from 'react'
import styles from './payInputButton.module.css'

export default function InputAddPay({setAmount=() => '', addPayment=() => '', amount='', remainingToPayUSD=1, isPending=true, state={}, 
                    activeScreen=null,
                    paymentMethodId=null,
                    paymentMethods=[],
                    total=null
                    }) {
    
    const inputRef = useRef(null)

    useEffect(() => {
        if (activeScreen === 'pay') {
            inputRef.current?.focus()
        }
    }, [activeScreen])

    useEffect(() => {
        const setTotalAmount = (event) => {
            const key = event.key.toLowerCase()

            if(key == 'end'){
                event.preventDefault()
                const payment = paymentMethods[paymentMethodId - 1]
                const total_amount = payment.currency != 'Dolares' ? total.total_bs : total.total_usd
                setAmount(total_amount)
            }
        }
        if (activeScreen == 'pay') {
            
            window.addEventListener('keydown', setTotalAmount)
            return () => window.removeEventListener('keydown', setTotalAmount)
        }
    }, [activeScreen, paymentMethodId])


    return (
        <div className={styles.container}>
            <input 
            ref={inputRef}
            className={`${styles.amountInput} ${remainingToPayUSD <= 0.01 ? styles.disabledInput : ''} shadow-sm`}
            autoComplete='off'
            type="number" 
            name="amount"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monto" 
            min="0.1" 
            step="0.01" 
            disabled={remainingToPayUSD <= 0.01 || isPending}
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
                remainingToPayUSD <= 0.01 && (
                    <Button type={'primary'} 
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
            
        </div>
    )
}
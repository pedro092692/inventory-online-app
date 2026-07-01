import { Button } from '@/app/ui/utils/button/buttons'
import { OvalLoader } from '@/app/ui/loader/spinner'
import styles from './payInputButton.module.css'

export default function InputAddPay({setAmount=() => '', addPayment=() => '', amount='', remainingToPayUSD=1, isPending=true}) {
    return (
        <div className={styles.container}>
            <input 
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
                        // children={isPending ? 'Procesando...' : 'Procesar Factura'}
                        className='shadow-sm' 
                        disabled={isPending}     
                    >
                        {isPending && <OvalLoader/>}
                        {isPending ? 'Procesando...' : 'Procesar Factura'}
                    </Button>
                )
            }
            
        </div>
    )
}
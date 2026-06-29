import { Button } from '@/app/ui/utils/button/buttons'
import styles from './payInputButton.module.css'

export default function InputAddPay({setAmount=() => '', addPayment=() => '', amount=''}) {
    return (
        <div className={styles.container}>
            <input 
            className={styles.amountInput}
            autoComplete='off'
            type="number" 
            name="amount"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monto" 
            min="0.1" 
            step="0.01" 
            onKeyDown={
                (e) => {
                    if (e.key === 'Enter'){
                        e.preventDefault();
                        addPayment();
                    }   
                }
            }
            />

            <Button type={'secondary'} 
                    onClick={addPayment}
                    showIcon={true}
                    icon={'sell'}
                    size={[24, 24]}
                    title={'Agregar Pago'}
                    children={'Agregar'}
            />        
            {/* <button type="button" onClick={addPayment}>Agregar Pago</button> */}
            
        </div>
    )
}
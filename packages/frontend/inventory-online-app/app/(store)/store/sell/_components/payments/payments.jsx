import styles from './payments.module.css'
import { Container} from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { Icon } from '@/app/ui/utils/icons/icons'

export default function Payments({payments=[], removePayment=()=>''}) {
    const icon = (paymentName) => {
        switch (paymentName) {
            case 'Punto de venta':
                return 'creditCard'
            break;
            case 'Efectivo Bolivares':
                return 'cash'
            break;
            case 'Efectivo Dolares':
                return 'cash'
            break;
            case 'Pago Movil':
                return 'phone'
            break;
            case 'Cripto':
                return 'crypto'
            break;
            case 'Nota de Credito':
                return 'store'
            break;
            default:
                return 'transfer'
            
        }
    }

    return (
        <div className={`${styles.container} shadow-bottom-sm`}>
            
            {payments.length > 0 ? (
                <>
                    <Container className={styles.paymentHeader}>
                        <div className={styles.headerName}>
                            <p className={'p3-b'}>
                                Método
                            </p>
                        </div>
                            <div className={styles.headerAmount}>
                            <p className={'p3-b'}>
                                Monto
                            </p>
                        </div>
                        <div className={styles.headerCurrency}>
                            <p className={'p3-b'}>
                                Moneda
                            </p>
                        </div>
                    </Container>
                    {
                        payments.map((payment, index) => (
                            <Container className={styles.paymentContent} key={index}>
                                <Container className={styles.paymentRow}>
                                    <div className={styles.paymentMethod}>
                                        <Icon icon={icon(payment.name)} size={[24, 24]} color={'var(--color-neutralBlack)'}/>
                                        <p className={'p1-r'}>{payment.name}</p>
                                    </div>

                                    <div className={styles.paymentAmount}>
                                        <p className={'p1-r'}>{new Intl.NumberFormat('es-VE').format(payment.amount)}</p>
                                    </div>

                                    <div className={styles.paymentCurrency}>
                                        <p className={'p1-r'}>{payment.currency}</p>
                                        <Button 
                                        icon={'trash'} 
                                        children={''} 
                                        showIcon={true} 
                                        type='danger' 
                                        size={[12, 12]} 
                                        style={{padding: '8px'}}
                                        onClick={() => removePayment(index)}
                                    />
                                    </div>
                                </Container>
                            </Container>
                            )
                        )
                    }
                </>
            ) 
            : 
                <p className='p1-r'>No hay pagos agregados aun. Agrega un pago</p>
            }
        </div>
    )
}
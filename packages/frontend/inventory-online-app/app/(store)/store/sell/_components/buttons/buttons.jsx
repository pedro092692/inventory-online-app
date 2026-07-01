import { Button } from '@/app/ui/utils/button/buttons'
import styles from './buttons.module.css'

export default function InvoiceActionButtons({items=[], screen=() => '', activeScreen=null, customer=null}) {
    return (
        <div className={styles.container}>
            <div className={styles.buttonsContainer}>
                <Button type={activeScreen == 'products' ? 'secondary' : 'nonActive'}
                    showIcon={true}
                    icon={'product'}
                    size={[24, 24]}
                    style={{padding: '8px'}}
                    onClick={() => screen('products')}
                    title={'Seleccionar Productos'}
                    children={''}
                    className={activeScreen == 'products' ? 'shadow' : 'shadow-sm'}
                />
                    
                <Button type={items.length === 0 ? 'disabled' : activeScreen == 'customer' ? 'secondary' : 'nonActive'} 
                    onClick={() => screen('customer')} 
                    disabled={items.length === 0 ? true : false}
                    showIcon={true}
                    size={[24, 24]}
                    style={{padding: '8px'}}
                    title={'Seleccionar cliente'}
                    children={''}
                    className={activeScreen == 'customer' ? 'shadow' : 'shadow-sm'}
                />
                
                <Button 
                    type={!customer || items.length < 1 ? 'disabled' : activeScreen == 'pay' ? 'secondary' : 'nonActive'}
                    disabled={!customer || items.length < 1 ? true : false}
                    showIcon={true}
                    icon={'creditCard'}
                    size={[24, 24]}
                    style={{padding: '8px'}}
                    title={'Getionar Pagos'}
                    onClick={() => screen('pay')}
                    children={''}
                    className={activeScreen == 'pay' ? 'shadow' : 'shadow-sm'}
                />
            </div>  
            <div className={`${styles.customerInfo} shadow-bottom-sm`}>
                {!customer ? 
                    <div className={styles.customerContainer}>
                            <p className={'p3-r'}>Nueva Venta:</p>
                            <p className={'p2-b'}>
                                {activeScreen == 'customer' ? 'Seleccione un cliente' : 'Seleccine un producto'}
                            </p>
                    </div>
                    :
                    <>
                        <div className={styles.customerContainer}>
                            <p className={'p3-r'}>Cliente:</p>
                            <p className={'p2-b textCapitalize'}>
                                {customer.name}
                            </p>
                        </div>
                        
                        <div className={styles.customerContainer}>
                            <p className={'p3-r'}>Cédula:</p>
                            <p className={'p2-b'}>
                                {new Intl.NumberFormat('es-Ve').format(customer.id_number)}
                            </p>
                        </div>

                        <div className={styles.customerContainer}>
                            <p className={'p3-r'}>Teléfono:</p>
                            <p className={'p2-b'}>
                                {customer.phone.replace('+58', '')}
                            </p>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}
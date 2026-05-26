'use client'
import { Form } from '@/app/ui/form/form/form'
import { Container } from '@/app/ui/utils/container'
import List from '@/app/ui/list/list'
import styles from './invoice.module.css'


export default function PaymentDetailForm({invoice=null}) {
    const paymentsDetails = invoice?.['payments-details'].map(payment => {
        return {
            paymentMethod: payment?.payments?.name || 'Undefined',
            amount: payment?.amount || 0,
            currenty: payment?.payments?.currency || 'Undefined',
            status: payment?.status == 'active' ? 'Activo' : 'Cancelado',
            id: payment?.id || null,
        }
    }) || []
   
    const date = new Date(invoice?.date).toISOString()

    return (
        <>
            <Form className={styles.form} style={{padding: '16px', flexGrow: '0'}}>
                <Container
                    width={'100%'}
                    padding={'8px'}
                    direction={'column'}
                    alignItem={'start'}
                    borderRadius={'8px'}
                    backgroundColor={'var(--color-neutralGrey300)'}
                    className='shadow'
                >   
                    <h2 className='h3'>Editar detalles de pago de la factura: #{invoice?.id}</h2>
                    <Container
                        padding={'0px'}
                        width={'100%'}
                        justifyContent={'space-between'}
                    >
                        <p>Fecha:</p>
                        <p className='p2'>{new Date(invoice?.date).toLocaleDateString('es-VE', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                    </Container>
                    <p>Hora: {new Intl.DateTimeFormat('es-VE', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC'
                    }).format(new Date(date))}</p>
                </Container>
                
                {/* seller */}
                <Container
                    padding={'0px'}
                >
                    <h3 className='p2-b'>Vendedor:</h3>
                    <p className='p2-r'>{invoice?.seller?.name || 'No tiene vendedor'}</p>
                </Container>
                
                {/* customer */}
                <Container
                    padding={'0px'}
                >
                    <h3 className='p2-b'>Cliente:</h3>
                    <p className='p2-r'>{invoice?.customer?.name || 'Error con el nombre del cliente'}</p>
                </Container>

            </Form>
        {/* payment details */}
            <Container
                width={'100%'}
                padding={'16px'}
                direction={'column'}
                alignItem={'start'}
                borderRadius={'8px'}
                backgroundColor={'var(--color-neutralGrey300)'}
                className='shadow'
            >   
                {
                    paymentsDetails.length > 0 ?
                        <List 
                            tableHead={{
                                'paymentMethod': 'Método de pago',
                                'amount': 'Monto',
                                'currenty': 'Moneda',
                                'status': 'Estado',
                                'actions': 'Acciones'
                            }}
                            tableData={paymentsDetails}
                            showActions={true}
                            showEdit={false}
                            showView={false}
                            deleteKey={'id'}
                            userPermissions={'delete'}
                            CustomStyles={{height: 'auto', borderRadius: '8px'}}
                            customClass={styles.table}
                        />
                    : 
                    <p>Esta order de compra no tienes pagos asociados...</p>
                }
                
            </Container>
        </>
    )
}
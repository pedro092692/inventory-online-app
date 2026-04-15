import { Container } from '@/app/ui/utils/container'
export default function PaymentDetails({ paymentDetails }) {
    console.log('paymentDetails', paymentDetails)
    return (
        <Container
            direction={'column'}
            width={'100%'}
            padding={'0px'}
            alignItem={'start'}
            // backgroundColor={'blue'}
        >
            <h3 className='p1-r'>Detalles de pago</h3>
            <Container
                padding={'16px'}
                width={'100%'}
                height={'100%'}
                borderRadius={'8px'}
                backgroundColor={'var(--color-neutralGrey300)'}
                className='shadow'
                direction={'column'}
                alignItem={'start'}
                gap={'24px'}
            >
                {
                    paymentDetails?.map((payment, index) => (
                        <Container key={index}
                            padding={'0px'}
                            gap={'4px'}
                            direction={'column'}
                            width={'100%'}
                            alignItem={'start'}
                        >
                            <Container key={index + 'content'} 
                                padding={'0px'} 
                                gap={'32px'}
                                width={'100%'}
                                justifyContent={'space-between'}
                            >
                                <p className='p2-b'>Método de pago: <span className='p2-r'>{payment?.payments?.name || 'N/A'}</span></p>
                                <p className='p2-b'>Moneda: <span className='p2-r'>{payment?.payments?.currency || 'N/A'}</span></p>
                            </Container>
                            <p className='p2-b'>Monto: <span className='p2-r'>{payment?.amount == payment?.reference_amount ? `$ ${payment?.amount}` : `${payment?.amount} Bs` || 'N/A'}</span></p>
                            <p className='p2-b'>Referencia: <span className='p2-r'>{`$ ${payment?.reference_amount}` || 'N/A'}</span></p>
                        </Container>
                        
                    ))
                }
            </Container>
        </Container>
    )
}
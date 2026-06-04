import { Container } from '@/app/ui/utils/container'

export default function InvoiceHeader({invoice=null}) {
    if (!invoice) return null
    
    const date = invoice?.date ? new Date(invoice.date).toISOString() : null
    
    return (
        <Container
            width={'100%'}
            padding={'4px 16px'}
            direction={'row'}
            alignItem={'center'}
            justifyContent={'space-between'}
            borderRadius={'8px'}
            backgroundColor={'var(--color-neutralGrey300)'}
            className='shadow'
        >   
            <Container
                padding={'0px'}
            >
                
            <p className='p1-b'>Nota de crédito de la factura: #{invoice?.id}</p>
            </Container>
            <Container
                padding={'0px'}
            >
                <p className='p2-r'>Fecha:</p>
                <p className='p2-r'>{new Date(invoice?.date).toLocaleDateString('es-VE', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                <p className='p2-r'>Hora: {new Intl.DateTimeFormat('es-VE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC'
                }).format(new Date(date))}</p>
            </Container>
        </Container>
    )
}

import { Container } from '@/app/ui/utils/container'
export default function InvoiceBasicDetails({invoice=null}) {
    if (!invoice) return null
    return (
        <Container
            width={'100%'}
            padding={'8px'}
            alignItem={'center'}
            justifyContent={'space-between'}
        >
           
            <Container
                padding={'0px'}
            >
                 {/* seller */}
                <h3 className='p2-b'>Vendedor:</h3>
                <p className='p2-r'>{invoice?.seller?.name || 'No tiene vendedor.'}</p>
                {/* customer */}
                <h3 className='p2-b'>Cliente:</h3>
                <p className='p2-r'>{invoice?.customer?.name || 'Error con el nombre del cliente.'}</p>
            </Container>
           

            {/* gran total */}
            <Container
                padding={'0px'}
            >
                <h3 className='p2-b'>Total:</h3>
                <p className='p2-r'>{`${invoice?.total} $` || 'Error en el monto.'}</p>
            </Container>
        </Container>
    )
}
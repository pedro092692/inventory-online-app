import { Container } from '@/app/ui/utils/container'
export default function BillStatusDetail({ status, total_paid, total, total_reference}) {
    return (
        <Container
            direction={'column'}
            width={'100%'}
            padding={'0px'}
            alignItem={'start'}
            // backgroundColor={'blue'}
        >
            <h3 className='p1-r'>Estatus de orden de compra</h3>
            <Container
                padding={'16px'}
                width={'100%'}
                borderRadius={'8px'}
                backgroundColor={'var(--color-neutralGrey300)'}
                className='shadow'
                direction={'column'}
                alignItem={'start'}
            >
                <p className='p2-b'>Estatus: <span className='p2-r'>{status == 'paid' ? 'Pagado ✅' : 'Pendiente ⚠️' || 'Status'}</span></p>
                {status != 'paid' && (
                    <p className='p2-b'>Total pagado: <span className='p2-r'>{`$${total_paid || 0}`}</span></p>
                )}
                <p className='p2-b'>Total: <span className='p2-r'>{`$${total}`}</span></p>
                <p>Total Bs: <span className='p2-r'>{`${total_reference} Bs`}</span></p>
            </Container>
        </Container>
    )
}
import { Container } from '@/app/ui/utils/container'
import { Input } from '@/app/ui/form/input/input'
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
                borderRadius={'8px'}
                backgroundColor={'var(--color-neutralGrey400)'}
                className='shadow'
                direction={'column'}
                alignItem={'start'}
                width={'100%'}
            >
                <label htmlFor="status">Estatus</label>
                <Input type='text' id='status' icon='alert' defaultValue={status == 'paid' ? 'Pagado ✅' : 'Pendiente ⚠️' || 'Status'} readOnly={true}/>
                {status != 'paid' && (
                    <>
                        <label htmlFor="total-paid">Total Tagado</label>
                        <Input type='text' id='total-paid' icon='coins' 
                        defaultValue={`$${total_paid || 0}`} readOnly={true}/>
                    </>
                )}
                <label htmlFor="total">Total Dolares</label>
                <Input type='text' id='total' icon='dollar' 
                    defaultValue={`${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(total)}`} readOnly={true}/>

                <label htmlFor="total-reference">Total Bs</label>
                <Input type='text' id='total-reference' icon='coins' 
                defaultValue={`${ new Intl.NumberFormat('es-VE', {style: 'currency', currency: 'VES'}).format(total_reference)}`} readOnly={true}/>
            </Container>
        </Container>
    )
}
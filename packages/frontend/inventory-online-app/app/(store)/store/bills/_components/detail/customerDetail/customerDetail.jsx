import { Input } from '@/app/ui/form/input/input'
import { Container } from '@/app/ui/utils/container'
export default function CustomerInfo({ customer }) {
    return (
        <Container
            direction={'column'}
            width={'100%'}
            padding={'0px'}
            alignItem={'start'}
        >
            <h3 className='p1-r'>Detalle del cliente</h3>
            <Container
                padding={'16px'}
                borderRadius={'8px'}
                backgroundColor={'var(--color-neutralGrey400)'}
                className='shadow'
                direction={'column'}
                alignItem={'start'}
                width={'100%'}
            >
                <label htmlFor="name">Nombre</label>
                <Input type='text' id='name' icon='person' defaultValue={customer?.name || 'customer name'} readOnly={true}/>
                <label htmlFor="id_number">Número de Cedula</label>
                <Input type='text' id='id_number' icon='id' defaultValue={customer?.id_number || 'ID number'} readOnly={true}/>
                <label htmlFor="phone">Teléfono</label>
                <Input type={customer?.phone.startsWith('+58') ? 'phone' : 'text'} id='phone' icon='phone' defaultValue={customer?.phone || 'Phone number'} readOnly={true}/>
            </Container>
        </Container>
    )
}
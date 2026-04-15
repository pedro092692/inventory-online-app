import { Input } from '@/app/ui/form/input/input'
import { Container } from '@/app/ui/utils/container'
export default function SellerInfo({ seller }) {
    return (
        <Container
            direction={'column'}
            width={'100%'}
            padding={'0px'}
            alignItem={'start'}
            // backgroundColor={'blue'}
        >
            <h3 className='p1-r'>Detalle del vendedor</h3>
            <Container
                padding={'16px'}
                borderRadius={'8px'}
                backgroundColor={'var(--color-neutralGrey400)'}
                className='shadow'
                direction={'column'}
                alignItem={'start'}
            >
                <label htmlFor="name">Nombre</label>
                <Input type='text' id='name' icon='person' defaultValue={seller?.name || 'seller name'} readOnly={true}/>
            </Container>
        </Container>
    )
}
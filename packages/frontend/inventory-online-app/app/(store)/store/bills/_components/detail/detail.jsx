import GetItemAction from '@/app/lib/actions/get'
import { Container } from '@/app/ui/utils/container'

export default async function BillInfo({ id }) {
    const endpoint = `invoices/${id}`
    const response = await GetItemAction(endpoint)
    const { data, error } = response
    await new Promise(resolve => setTimeout(resolve, 1000))
    const invoice = data?.invoice || null
    return (
        <Container
            direction={'column'}
            width={'100%'}
            flexGrow={'1'}
            padding={'16px'}
            alignItem={'start'}
            backgroundColor={'red'}
            borderRadius={'8px'}
            className='shadow'
        >
            
        </Container>
    )
}



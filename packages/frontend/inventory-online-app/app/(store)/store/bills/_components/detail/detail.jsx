import GetItemAction from '@/app/lib/actions/get'
import { Container } from '@/app/ui/utils/container'
import CustomerInfo from '@/app/(store)/store/bills/_components/detail/customerDetail/customerDetail'
import SellerInfo from '@/app/(store)/store/bills/_components/detail/sellerDetail/sellerDetail'
import BillStatusDetail from '@/app/(store)/store/bills/_components/detail/status/status'
import PaymentDetails from '@/app/(store)/store/bills/_components/detail/paymentDetail/paymentDetail'
import ProductDetails from '@/app/(store)/store/bills/_components/detail/productDetail/productDetail'

export default async function BillInfo({ id }) {
    const endpoint = `invoices/${id}`
    const response = await GetItemAction(endpoint)
    const { data, error } = response
    // await new Promise(resolve => setTimeout(resolve, 1000))
    const invoice = data?.invoice || null
    // console.log(invoice)
    return (
        <Container
            direction={'column'}
            width={'100%'}
            flexGrow={'1'}
            padding={'24px'}
            alignItem={'start'}
            borderRadius={'8px'}
            className='shadow'
            gap={'16px'}
            // backgroundColor={'var(--color-neutralGrey300)'}
        >
            {/* date and time of the invoice */}
            <Container
                padding={'0px'}
                direction={'row'}
                width={'100%'}
                justifyContent={'space-between'}
            >
                
                {/* order id */}
                <h3 className='p2-b'>N° Recibo: 
                    <span className='p2-r'>
                        {` ${String(invoice?.id).padStart(8, '0')|| ''}`}
                    </span>
                </h3>
                {/* date: */}
                <Container padding={'0px'}>
                    <h3 className='p2-b'>Fecha: 
                        <span className='p2-r'>
                            {` ${invoice?.date ? formaDate(invoice?.date) : ''}`}
                        </span>
                    </h3>
                    {/* time */}
                    <h3 className='p2-b'>Hora: 
                        <span className='p2-r'>
                            {` ${invoice?.date ? formaDate(invoice?.date, true) : ''}`}
                        </span>
                    </h3>
                </Container>
            </Container>
            
            {/* invoice details */}
            <Container
                padding={'0px'}
                direction={'row'}
                gap={'16px'}
                alignItem={'start'}
                justifyContent={'start'}
                width={'100%'}
                // backgroundColor={'red'}
            >            
                {/* customer details */}
                <CustomerInfo customer={invoice?.customer}/>

                <Container
                    padding={'0px'}
                    gap={'24px'}
                    direction={'column'}
                    alignItem={'start'}
                    width={'100%'}
                    // backgroundColor={'blue'}
                >   
                
                {/* seller details */}
                <SellerInfo seller={invoice?.seller}/>
                {/* status */}
                <BillStatusDetail status={invoice?.status} total_paid={invoice?.total_paid} total={invoice?.total} 
                total_reference={invoice?.total_reference}/>
                
                
                </Container>
                
                {/* payment details */}
                {invoice?.['payments-details']?.length > 0 && <PaymentDetails paymentDetails={invoice['payments-details']}/>}
            </Container>
            
            {/* products details */}
            {invoice?.['products']?.length > 0 && <ProductDetails productsDetails={invoice['products']}/>}
                
        </Container>
    )
}



function formaDate(date, time = false) {
    if(!time) {
        return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
    }

    const actualDate = new Date(date)
    let hours = actualDate.getUTCHours()
    let minutes = actualDate.getUTCMinutes()
    const ampm = hours >=12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const min = minutes.toString().padStart(2, '0')
    return `${hours}:${min} ${ampm}`
}

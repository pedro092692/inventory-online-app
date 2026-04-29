import GetItemAction from '@/app/lib/actions/get'
import { Container } from '@/app/ui/utils/container'
import CustomerInfo from '@/app/(store)/store/bills/_components/detail/customerDetail/customerDetail'
import BillStatusDetail from '@/app/(store)/store/bills/_components/detail/status/status'
import PaymentDetails from '@/app/(store)/store/bills/_components/detail/paymentDetail/paymentDetail'
import ProductDetails from '@/app/(store)/store/bills/_components/detail/productDetail/productDetail'
import InvoicePDF from '@/app/(store)/store/bills/_components/pdf/pdf'
import InvoiceBasicInfo from '@/app/(store)/store/bills/_components/detail/basicInfo/basicInfo'
import { Button } from '@/app/ui/utils/button/buttons'
import { Icon } from '@/app/ui/utils/icons/icons'
import { getCurrentUser } from '@/app/utils/getCurrentUser'
import Link from 'next/link'

export default async function BillInfo({ id }) {
    const endpoint = `invoices/${id}`
    const response = await GetItemAction(endpoint)
     const currentUser = await getCurrentUser()
    const { data, error } = response
    // await new Promise(resolve => setTimeout(resolve, 1000))
    const invoice = data?.invoice || null
    return (
        <>
        {invoice ?
        <Container
            direction={'column'}
            width={'100%'}
            flexGrow={'1'}
            padding={'24px'}
            alignItem={'start'}
            borderRadius={'8px'}
            className='shadow'
            gap={'16px'}
            id='invoice'
        >
            {/* download invoice in pdf */}
            <Container
                width={'100%'}
                padding={'0px'}
                gap={'16px'}
                direction={'row'}
                justifyContent={'end'}
            >
                {/* actions */}
                {/* download pdf */}
                <InvoicePDF 
                    info={<InvoiceBasicInfo invoice={invoice}/>} 
                    customer={<CustomerInfo customer={invoice?.customer}/>}
                    billStatus={
                        <BillStatusDetail status={invoice?.status} 
                                          total_paid={invoice?.total_paid} 
                                          total={invoice?.total} 
                                          total_reference={invoice?.total_reference}/>
                    }
                    products={invoice?.['products']?.length > 0 && <ProductDetails productsDetails={invoice['products']}/>}
                    payments={invoice?.['payments-details']?.length > 0 && <PaymentDetails paymentDetails={invoice['payments-details']}/>}
                    id={invoice?.id}
                    />
                {/* edit */}
                {['admin', 'storeOwner', 'storeManager'].includes(currentUser?.role_name) && 
                    <Link href={`/store/bills/edit/${invoice?.id}`}>
                        <Button type='grey' style={{backgroundColor: 'var(--color-accentOrange400)'}}
                        >
                            <Icon icon='edit' size={[24, 24]}></Icon>
                        </Button>
                    </Link>
                }
            </Container>

            {/* date and time of the invoice */}
            <InvoiceBasicInfo invoice={invoice}/>
            
            {/* invoice details */}
            <Container
                padding={'0px'}
                direction={'row'}
                gap={'16px'}
                alignItem={'start'}
                justifyContent={'start'}
                width={'100%'}
            >            
                {/* customer details */}
                <CustomerInfo customer={invoice?.customer}/>    
            
                {/*invoices status */}
                <BillStatusDetail status={invoice?.status} total_paid={invoice?.total_paid} total={invoice?.total} 
                total_reference={invoice?.total_reference}/>   
            </Container>
                     
            
            {/* products details */}
            {invoice?.['products']?.length > 0 && <ProductDetails productsDetails={invoice['products']}/>}

            {/* payment details */}
            {invoice?.['payments-details']?.length > 0 && <PaymentDetails paymentDetails={invoice['payments-details']}/>}
    
        </Container>
        :
        <p>Orden no encontrada...</p>
        }
        </>
    )
}





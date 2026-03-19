import Route from '@/app/ui/routesLinks/routes'
import { Container } from '@/app/ui/utils/container'
import CustomerInfo from '@/app/(store)/store/customers/_components/detail/detail'
import { Suspense } from 'react'
import FetchData from '@/app/utils/fetch'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function CustomerDetail({ params, searchParams }) {
    const { id } = await params
    const urlParams = await searchParams
    const invoicePage = Number(urlParams?.invoice_page) || 1
    const invoiceQuery = Number(urlParams?.invoice) || null
    
    const totalInvoicePages = await FetchData(`${NEXT_PUBLIC_API_BASE_URL}/api/customers/total-invoices?id=${id}`, 'GET')
    
    
    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
            <Route path='customers' endpoints={['default', 'detail']} /> 

            <Suspense fallback={<p>Cargando...</p>}>
                <CustomerInfo 
                    id={id} 
                    page={invoicePage}
                    invoiceQuery={invoiceQuery}
                    totalInvoicePages={totalInvoicePages.total}
                />
            </Suspense>
           
       </Container>
    )
}


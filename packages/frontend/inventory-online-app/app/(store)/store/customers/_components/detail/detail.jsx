import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import CustomerDetailForm from '@/app/(store)/store/customers/_components/detail/formDetail'
import CustomerInvoicesWrapper from '@/app/(store)/store/customers/_components/detail/customerInvoices'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import Search from '@/app/ui/form/search/search'
import Pagination from '@/app/ui/pagination/pagination'
import { Suspense } from 'react'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'


export default async function CustomerInfo({id, limit = 8, page = 1, invoiceQuery = null, totalInvoicePages = 0}) {
    
    const fetch = withErrorHandler(FetchData, 'hubo un error inesperado')

    const endpoint = `/api/customers/${id}`
    const params = new URLSearchParams()
    params.append('limitInvoices', limit)
    params.append('pageInvoices', page)
    
    const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}?${params.toString()}`
    

    const response = await fetch(url, 'GET')
    const {data, error} = response
    const customer = data?.customer || null
    

    return (
        <>
            <CustomerDetailForm customer={customer}/>
            {totalInvoicePages > 0 ?
                <>
                    <p style={{marginTop: '15px'}} className='p1-r'>Facturas De: {`${customer?.name}`}</p>
                    <Search 
                        placeHolder="Buscar N° de Recibo..."
                        inputMode="number"
                        paramName="invoice"
                        page_param="invoice_page"
                    />
                    <Suspense
                        key={invoiceQuery + page}
                        fallback={<ListSkeleton nRows={4} nTitle={6} customStyles={{height: '317px'}}/>}
                    >
                        <CustomerInvoicesWrapper 
                            id={id} 
                            page={page} 
                            invoiceQuery={invoiceQuery} 
                            limit={limit}
                        />
                    </Suspense>
                   
                    
                    <Pagination totalPages={totalInvoicePages} paramName={'invoice_page'} />
                </>
                
                : 
                <p className='p1-b' style={{marginTop: '15px'}}>El cliente no tiene facturas</p>
            
            }
        </>
    )
    
}
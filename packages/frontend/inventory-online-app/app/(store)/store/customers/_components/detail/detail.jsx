import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import CustomerDetailForm from '@/app/(store)/store/customers/_components/detail/formDetail'
import CustomerInvoices from '@/app/(store)/store/customers/_components/invoices/invoices'
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
    let invoices = customer?.invoices || []
    let searchIsActive = false
    
   if (invoiceQuery) {
        const endpoint = `${NEXT_PUBLIC_API_BASE_URL}/api/invoices/search`
        const url = `${endpoint}?invoice=${invoiceQuery}&customer_id=${id}&limit=${limit}&invoice_page=${page}`

        const res = await fetch(url, 'GET')

        invoices = res.data?.invoices || []
        totalInvoicePages = res.data?.totalPages || 1
        searchIsActive = true

    }

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
                    <CustomerInvoices invoices={invoices} searchIsActive={searchIsActive} />
                    <Pagination totalPages={totalInvoicePages} paramName={'invoice_page'} />
                </>
                
                : 
                <p className='p1-b' style={{marginTop: '15px'}}>El cliente no tiene facturas</p>
            
            }
        </>
    )
    
}
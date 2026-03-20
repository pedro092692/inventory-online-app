import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import CustomerInvoices from '@/app/(store)/store/customers/_components/invoices/invoices'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function CustomerInvoicesWrapper({id, page, invoiceQuery, limit = 8}) {
    
    const endpoint = invoiceQuery
    ? `/api/invoices/search?invoice=${invoiceQuery}&customer_id=${id}&limit=${limit}&invoice_page=${page}`
    : `/api/customers/${id}?limitInvoices=${limit}&pageInvoices=${page}` 
    
    const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`
    const fetch = withErrorHandler(FetchData, 'hubo un error inesperado al cargar las facturas del cliente')
 
    const response = await fetch(url, 'GET')
    const {data, error} = response
    let invoices = data?.customer?.invoices || data?.invoices ||[]
    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    return <CustomerInvoices invoices={invoices} searchIsActive={invoiceQuery ? true : false} />

}
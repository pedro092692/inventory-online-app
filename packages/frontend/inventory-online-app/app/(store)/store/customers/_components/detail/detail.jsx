import CustomerDetailForm from '@/app/(store)/store/customers/_components/detail/formDetail'
import CustomerInvoicesWrapper from '@/app/(store)/store/customers/_components/detail/customerInvoices'
import GetItemAction from '@/app/lib/actions/get'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import Search from '@/app/ui/form/search/search'
import Pagination from '@/app/ui/pagination/pagination'
import styles from './detail.module.css'
import { Suspense } from 'react'


export default async function CustomerInfo({id, limit = 8, page = 1, invoiceQuery = null, totalInvoicePages = 0}) {
    let totalPages = totalInvoicePages

    const endpoint = `customers/${id}`
    const params = new URLSearchParams()
    params.append('limitInvoices', limit)
    params.append('pageInvoices', page)
    
    const url = `${endpoint}?${params.toString()}`

    const response = await GetItemAction(url)
    const {data, error} = response
    const customer = data?.customer || null
    const pendingInvoices = customer?.invoices.filter(invoice => invoice.status == 'unpaid') || []
    
    console.log(customer)
    if (invoiceQuery) {
        const endpoint = `invoices/search?invoice=${invoiceQuery}&customer_id=${id}&limit=${limit}&invoice_page=${page}`
        const res = await GetItemAction(endpoint)
        const {data, error} = res
        totalPages = data?.totalPages || 1
    }
    
    return (
        <>  
            {
                error ? 
                (    
                    <p className='p2-r errorMsg'>{error}</p>
                ) 
                : 
                <>
                    <div className={styles.mainContainer}>
                        <CustomerDetailForm customer={customer}/>
                        
                        {/* customer credit and debt info */}
                        <p>Este cliente tiene un credito disponible de: {customer.total_credits}</p>
                        <p>Este cliente tiene un total de {pendingInvoices.length} facturas sin pagar</p>
                    </div>
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
                        
                            
                            <Pagination totalPages={totalPages} paramName={'invoice_page'} />
                        </>
                        
                        : 
                        <p className='p1-b' style={{marginTop: '15px'}}>El cliente no tiene facturas</p>
                    
                    }
                </>
            }
        </>
    )
    
}
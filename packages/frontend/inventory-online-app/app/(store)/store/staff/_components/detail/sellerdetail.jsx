import SellerDetailForm from '@/app/(store)/store/staff/_components/detail/sellerDetailForm'
import CustomerInvoicesWrapper from '@/app/(store)/store/customers/_components/detail/customerInvoices'
import GetItemAction from '@/app/lib/actions/get'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import Search from '@/app/ui/form/search/search'
import Pagination from '@/app/ui/pagination/pagination'
import styles from '@/app/(store)/store/customers/_components/detail/detail.module.css'
import { Suspense } from 'react'


export default async function SellerInfo({id, limit = 8, page = 1, invoiceQuery = null, totalInvoicePages = 0}) {
    let totalPages = totalInvoicePages

    const endpoint = `sellers/${id}`
    const params = new URLSearchParams()
    params.append('limitInvoices', limit)
    params.append('pageInvoices', page)
    
    const url = `${endpoint}?${params.toString()}`

    const response = await GetItemAction(url)
    const {data, error} = response
    const seller = data?.seller || null
    
    
    if (invoiceQuery) {
        const endpoint = `invoices/search?invoice=${invoiceQuery}&seller_id=${id}&limit=${limit}&invoice_page=${page}`
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
                        <SellerDetailForm seller={seller}/>
                        
                    </div>
                    {/* {totalInvoicePages > 0 ?
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
                    
                    } */}
                </>
            }
        </>
    )
    
}
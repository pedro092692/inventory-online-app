import Route from '@/app/ui/routesLinks/routes'
import GetItemAction from '@/app/lib/actions/get'
import { buildQueryParams } from '@/app/utils/buildQueryParams'
import { Container } from '@/app/ui/utils/container'
// import CustomerInvoiceInfo from '@/app/(store)/store/bills/_components/edit/customer/customer'
// import InvoiceBasicInfo from '@/app/(store)/store/bills/_components/detail/basicInfo/basicInfo'


export default async function EditInvoice({ params, searchParams }) {
    const { id } = await params
    const endpoint = `invoices/${id}`
    const response = await GetItemAction(endpoint)
    const { data, error } = response
    const invoice = data?.invoice || null
    const ulrParams = await searchParams
    const queryString = buildQueryParams(ulrParams, ['page', 'data'])

    // await new Promise(resolve => setTimeout(resolve, 1000))
    if (error) {
        return(
            <>
                <Route path='bills' endpoints={['detail', 'edit']}  queryString={queryString} id={id}/>
                <p className='p2-r errorMsg'>{error}</p>
            </>
        ) 
        
    }

    return (
        <>
            <Route path='bills' endpoints={['detail', 'edit']}  queryString={queryString} id={id}/>
            {/* date and time of the invoice */}
            {/* <InvoiceBasicInfo invoice={invoice}/> */}
            {/* <CustomerInvoiceInfo customer={invoice?.customer}/> */}
        </>
    )
}
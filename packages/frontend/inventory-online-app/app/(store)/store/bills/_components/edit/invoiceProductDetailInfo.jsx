import GetItemAction from '@/app/lib/actions/get'
import ProductDetailForm from '@/app/(store)/store/bills/_components/edit/productDetailForm'


export default async function InvoiceroductDetailInfo({id, page, totalProductPages, queryString, limit = 5}){
    const endpointInvoice = `invoices/${id}`
    const params = new URLSearchParams()
    params.append('limitProducts', limit)
    params.append('pageProducts', page)
    const url = `${endpointInvoice}?${params.toString()}`

    const response = await GetItemAction(url)
    const { data, error: invoiceError } = response
    const invoice = data?.invoice || null

    // await new Promise(resolve => setTimeout(resolve, 2000))
    if (invoiceError) {
        return <p className='p2-r errorMsg'>{invoiceError}</p>
    }
    return (
        <ProductDetailForm invoice={invoice} page={page} totalProductPages={totalProductPages} queryString={queryString} />
    )
}
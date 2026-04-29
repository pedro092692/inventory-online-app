import Route from '@/app/ui/routesLinks/routes'
import GetItemAction from '@/app/lib/actions/get'
import { buildQueryParams } from '@/app/utils/buildQueryParams'

export default async function EditInvoice({ params, searchParams }) {
    const { id } = await params
    const endpoint = `invoices/${id}`
    const response = await GetItemAction(endpoint)
    const { data, error } = response
    const invoice = data?.invoice || null
    const ulrParams = await searchParams
    const queryString = buildQueryParams(ulrParams, ['page', 'data'])

    console.log(queryString)
    // await new Promise(resolve => setTimeout(resolve, 1000))

    return (
        <>
            <Route path='bills' endpoints={['detail', 'edit']}  queryString={queryString} id={id}/>
            <p>Welcome to edit invoice details {id}</p>
        </>
    )
}
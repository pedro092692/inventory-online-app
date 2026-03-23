import { buildQueryParams } from '@/app/utils/buildQueryParams'
import Route from '@/app/ui/routesLinks/routes'
import AddClientForm from '@/app/(store)/store/customers/_components/add/addCustomerForm'

export default async function AddCustomer({searchParams}){
    const urlParams = await searchParams
    const queryString = buildQueryParams(urlParams, ['page', 'data'])


    return (
        <>
            <Route path='customers' endpoints={['default', 'add']} queryString={queryString}/> 
            <AddClientForm/>
        </>
        
    )
}
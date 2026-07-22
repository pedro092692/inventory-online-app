import { buildQueryParams } from '@/app/utils/buildQueryParams'
import Route from '@/app/ui/routesLinks/routes'
import AddCurrencyValueForm from '@/app/(store)/store/currency/_components/add/addCurrencyForm'

export default async function AddCustomer({searchParams}){
    const urlParams = await searchParams
    const queryString = buildQueryParams(urlParams, ['page'])


    return (
        <>
            <Route path='currency' endpoints={['default', 'add']} queryString={queryString}/> 
            <AddCurrencyValueForm />
        </>
        
    )
}
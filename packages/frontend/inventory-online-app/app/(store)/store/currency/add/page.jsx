import { buildQueryParams } from '@/app/utils/buildQueryParams'
import Route from '@/app/ui/routesLinks/routes'

export default async function AddCustomer({searchParams}){
    const urlParams = await searchParams
    const queryString = buildQueryParams(urlParams, ['page'])


    return (
        <>
            <Route path='currency' endpoints={['default', 'add']} queryString={queryString}/> 
            <p>currency add new value</p>
        </>
        
    )
}